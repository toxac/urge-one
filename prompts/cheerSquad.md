# Urge Cheer Squad

## Overview
**Personal Success Network**. The Cheer Squad transforms the solitary journey of entrepreneurship into a shared adventure. It is Urge’s dedicated mechanism for injecting accountability, motivation, and empathy into the often-challenging process of starting a business.

### Why Urge Has the Cheer Squad
We know the real barriers to starting are internal: fear, doubt, and isolation. These are not problems solved by software or concepts alone; they require human connection.

- **Combats Isolation**: The entrepreneurial path is lonely. The Cheer Squad ensures the user has a ready-made support crew of people who genuinely believe in them and understand their commitment.
- **Instills Commitment (Accountability)**: By making goals public to their inner circle, users create powerful social accountability. They are far more likely to follow through on their Challenges and Exercises when others are watching and expecting updates.
- **Builds Resilience**: When rejection hits (and it will!), having pre-approved friends and family ready to offer specific encouragement helps the founder reframe the setback as data, not failure.
- **Authentic Support**: It leverages the founder's existing relationships (friends, family) as a primary source of positive reinforcement, which is often the most powerful form of support available.

### How Users Add Someone to the Cheer Squad
Adding someone is a simple, permission-based process that emphasizes user control:

- selection: In the program, typically after the "Accountability Boost" Concept (M1), the user is prompted to identify 1-3 people (friends, family, trusted peers) they want in their inner circle. Alternative;y, users can also add memeber to their squad in assets/squad.

- Invitation: The user is provided with pre-written message templates (available in M1 exercises) to explain the purpose of the Cheer Squad and ask for permission to include them. This helps the founder build their "ask muscle."

- Opt-in Mechanism: The invitee must opt-in via a simple link, confirming they are willing to receive updates on the founder's progress.

- Platform Integration: Once accepted, the Cheer Squad member's email/contact details are stored, linking them to the founder's profile for automated updates and sharing privileges.

### What Is Communicated to Squad Members?
The communication is structured to keep the cheer squad informed without overwhelming them, focusing on high-value updates:
**Automated Event Based**
- Progress Milestones: Automated notifications (via email or in-app link) when the founder completes significant Milestones or tough Challenges. (e.g., "Congratulations! [Founder Name] just completed the '10 Nos Challenge'!")

- Goal Sharing: Updates on the SMART Goals the founder has set, including their weekly progress reports (Logs).
- Launches

**User Messages**
- Journal: The founder can selectively share specific Journal entries (especially 'celebrations' or 'appeals' for help/advice) directly with the squad for personalized feedback and encouragement.
- Launches:

Clear CTAs (for the Squad): When a notification is sent, it includes a soft Call-to-Action for the squad member (e.g., "Send [Founder Name] a quick note of encouragement!" or "They need feedback on their pitch draft!"). This guides the squad on how to offer effective support.

## Cheer Squad Schema


```ts
 user_cheer_squad: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          relationship: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          relationship?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          relationship?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_cheer_squad_updates: {
        Row: {
          cheer_squad_id: string
          created_at: string | null
          id: string
          status: string | null
          type: string
          update_link: string | null
          update_text: string | null
          user_id: string
        }
        Insert: {
          cheer_squad_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          type: string
          update_link?: string | null
          update_text?: string | null
          user_id: string
        }
        Update: {
          cheer_squad_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          type?: string
          update_link?: string | null
          update_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cheer_squad_updates_cheer_squad_id_fkey"
            columns: ["cheer_squad_id"]
            isOneToOne: false
            referencedRelation: "user_cheer_squad"
            referencedColumns: ["id"]
          },
        ]
      }

```