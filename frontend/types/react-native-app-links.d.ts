declare module "react-native-app-link" {
  interface AppLinkOptions {
    appName: string;
    appStoreId?: string;
    appStoreLocale?: string;
    playStoreId?: string;
  }

  const AppLink: {
    maybeOpenURL(url: string, options: AppLinkOptions): Promise<void>;
    openInStore(options: AppLinkOptions): Promise<void>;
  };

  export default AppLink;
}
