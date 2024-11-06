#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
// #import <Firebase.h>
// #import <FBSDKCoreKit/FBSDKCoreKit.h>

@implementation AppDelegate

// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
//   // Firebase yapılandırması
//   [FIRApp configure];

//   // Facebook SDK yapılandırması
//   [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];

  // React Native yapılandırması
  self.moduleName = @"ElearningMobile";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//   return [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options];
// }

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [self bundleURL];
}

- (NSURL *)bundleURL {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
