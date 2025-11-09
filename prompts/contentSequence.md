# Generate Content Sequence 
I want to genrate a array of informations based on the content (mdx files) sequence in my /src/content folder. 
## Contex
- Content is organized in on src/content folder following schema defined in content ***src/content.config.ts***.
- Each content file has front matter key of next and previous, defined as type and id. Type is content type of the folder reference within content and id is the file slug. 
## Task
- Read the file content sequentially starting with "/src/content/milestones/milestone-1-begin-your-thrilling-new-adventure.mdx" and follow the sequence using next key.
- read the frontmatter and extract key info in an object and insert it to array contentSequence. Refer below for format of data

```ts

type ContentMetaData = {
    slug: string;
    contentMetaId: string | null;
    programId: string;
    title: string;
    subtitle: string;
    pubDate:string;
    updatedDate: string;
    description: string;
    sequence: number;
}

const contentSequence: ContentMetaData[] = [{

}]

```

Ask me if you have any clarifications, You can create new file with array @src/contentSequence.ts