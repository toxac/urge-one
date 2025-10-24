interface EntryDataFormProps {
  category: string;
  entryData: any;
  onNext: (data: any) => void;
}

export default function EntryDataForm(props: EntryDataFormProps) {
  switch (props.category) {
    case "reflection":
      return <ReflectionForm initialData={props.entryData} onNext={props.onNext} />;
    case "build":
      return <BuildForm initialData={props.entryData} onNext={props.onNext} />;
    case "market":
      return <MarketForm initialData={props.entryData} onNext={props.onNext} />;
    case "money":
      return <MoneyForm initialData={props.entryData} onNext={props.onNext} />;
    default:
      return <div>Unknown category</div>;
  }
}
