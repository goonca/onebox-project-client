export enum StoryBookAtomicDesignLevel {
  Components = 'Components'
}

export const prepareStoryBookName = (
  level: StoryBookAtomicDesignLevel,
  componentName: string
): string => `${level}/${componentName}`;
