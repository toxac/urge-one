import { supabaseBrowserClient } from '../supabase/client';
import type { Database } from '../../../database.types';
import { addRole } from '../../stores/roles';
import { notify } from '../../stores/notifications';

type UserEnrollmentsInsert = Database['public']['Tables']['user_enrollments']['Insert'];
type UserMembershipsInsert = Database['public']['Tables']['user_memberships']['Insert'];
type UserEventsInsert = Database['public']['Tables']['user_events']['Insert'];

export interface FlowResult {
  success: boolean;
  error?: string;
}

export const processEnrollment = async (
  userId: string,
  offering: any,
  transactionId: string,
  currentDate: string
): Promise<FlowResult> => {
  try {
    // 1. Add to user_enrollments
    const enrollmentPayload: UserEnrollmentsInsert = {
      enrolled_at: currentDate,
      user_id: userId,
      program_id: offering.related_entity_id,
      program_name: offering.name,
      transaction_id: transactionId,
    };

    const { error: enrollmentError } = await supabaseBrowserClient
      .from("user_enrollments")
      .insert(enrollmentPayload);

    if (enrollmentError) throw new Error("Could not enroll user");

    // 2. Add 6 months free membership
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 6);
    const membershipExpirationDate = date.toISOString();

    const membershipPayload: UserMembershipsInsert = {
      created_at: currentDate,
      valid_until: membershipExpirationDate,
      user_id: userId,
      offering_id: offering.id,
      status: 'active',
      transaction_id: transactionId,
    };

    const { error: membershipError } = await supabaseBrowserClient
      .from("user_memberships")
      .insert(membershipPayload);

    if (membershipError) throw new Error("Could not create membership");

    // 3. Add user roles with proper error handling
    const enrolledRoleResult = await addRole({
      user_id: userId,
      role_id: 2,
      role_name: "enrolled",
    });

    if (enrolledRoleResult.error) {
      throw new Error(`Failed to add enrolled role: ${enrolledRoleResult.error}`);
    }

    const subscriberRoleResult = await addRole({
      user_id: userId,
      role_id: 3,
      role_name: "subscriber",
      valid_until: membershipExpirationDate
    });

    if (subscriberRoleResult.error) {
      throw new Error(`Failed to add subscriber role: ${subscriberRoleResult.error}`);
    }

    // 4. Show success notification
    notify.success(`You have joined ${offering.name} with 6 months membership to Urge Network`, "Success!");

    return { success: true };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown enrollment error' 
    };
  }
};

export const processSubscription = async (
  userId: string,
  offering: any,
  transactionId: string,
  currentDate: string
): Promise<FlowResult> => {
  try {
    // 1. Add to user_memberships
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + (offering.duration_months || 1));
    const membershipExpirationDate = date.toISOString();

    const membershipPayload: UserMembershipsInsert = {
      created_at: currentDate,
      valid_until: membershipExpirationDate,
      user_id: userId,
      offering_id: offering.id,
      status: 'active',
      transaction_id: transactionId,
    };

    const { error: membershipError } = await supabaseBrowserClient
      .from("user_memberships")
      .insert(membershipPayload);

    if (membershipError) throw new Error("Could not create membership");

    // 2. Add user role
    const subscriberRoleResult = await addRole({
      user_id: userId,
      role_id: 3,
      role_name: "subscriber",
      valid_until: membershipExpirationDate
    });

    if (subscriberRoleResult.error) {
      throw new Error(`Failed to add subscriber role: ${subscriberRoleResult.error}`);
    }

    // 4. Show success notification
    notify.success(`You have subscribed to ${offering.name} to urge network`, "Success!");

    return { success: true };
  } catch (error) {
    console.error("Subscription error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown subscription error' 
    };
  }
};

export const processEventRegistration = async (
  userId: string,
  offering: any,
  transactionId: string,
  currentDate: string
): Promise<FlowResult> => {
  try {
    // 1. Add to user_events
    const eventPayload: UserEventsInsert = {
      user_id: userId,
      event_id: offering.related_entity_id,
      created_at: currentDate,
      transaction_id: transactionId,
      participant_type:"attendee",
      status: 'confirmed',
    };

    const { error: eventError } = await supabaseBrowserClient
      .from("user_events")
      .insert(eventPayload);

    if (eventError) throw new Error("Could not register for event");

    // 2. Show success notification
    notify.success(`You have registered for ${offering.name}`, "Success!");

    return { success: true };
  } catch (error) {
    console.error("Event registration error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown registration error' 
    };
  }
};