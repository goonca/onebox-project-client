import { NewsContext, UserModel } from 'shared/types/api-type';

export const getEmptyNews = (currentUser: UserModel | undefined, id: any) => ({
  id,
  title: 'Title',
  headline: 'Headline',
  user: currentUser,
  userId: currentUser?.id,
  createdAt: new Date(),
  showAuthor: true,
  showDate: true,
  components: [],
  context: NewsContext.REGION
});
