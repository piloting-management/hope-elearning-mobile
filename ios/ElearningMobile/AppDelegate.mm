#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                            didFinishLaunchingWithOptions:launchOptions];
  self.moduleName = @"ElearningMobile";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  return handled;
}

- (void)applicationWillResignActive:(UIApplication *)application {    
    // fill screen with our own colour
    UIView *colourView = [[UIView alloc]initWithFrame:self.window.frame];
    colourView.backgroundColor = [UIColor whiteColor];
    colourView.tag = 1234;
    colourView.alpha = 0;
    [self.window addSubview:colourView];
    [self.window bringSubviewToFront:colourView];
    // fade in the view
    [UIView animateWithDuration:0.5 animations:^{
        colourView.alpha = 1;
    }];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // grab a reference to our coloured view
    UIView *colourView = [self.window viewWithTag:1234];
    // fade away colour view from main view
    [UIView animateWithDuration:0.5 animations:^{
        colourView.alpha = 0;
    } completion:^(BOOL finished) {
        // remove when finished fading
        [colourView removeFromSuperview];
    }];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
