export interface RootObject {
  activities: Activity[];
  watermark: string;
}

export interface Activity {
  type: string;
  id: string;
  timestamp: string;
  channelId: string;
  from: From;
  conversation: Conversation;
  locale: string;
  text: string;
  speak?: string;
  attachments?: Attachment[];
  entities?: any[];
  suggestedActions?: SuggestedActions;
  serviceUrl?: string;
  replyToId?: string;
  attachmentLayout?: string;
}

interface SuggestedActions {
  actions: Action[];
}

interface Action {
  type: string;
  title: string;
  value: string;
}

interface Attachment {
  contentType: string;
  content: Content;
}

interface Content {
  lgtype: string;
  title: string;
  subtitle: string;
  images: Image[];
  buttons: Button[];
}

interface Button {
  type: string;
  title: string;
  image?: any;
  text?: any;
  displayText?: any;
  value: string;
  channelData?: any;
  imageAltText?: any;
}

interface Image {
  url: string;
}

interface Conversation {
  id: string;
}

interface From {
  id: string;
  name?: string;
}
