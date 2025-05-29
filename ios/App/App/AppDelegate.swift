import UIKit
import Capacitor
import FirebaseCore
import GoogleSignIn // <--- !!! IMPORTANT: This import is crucial for GIDSignIn !!!

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.OpenURLOptionsKey: Any]?) -> Bool {
        // Initialize Firebase. This should be one of the first things you do.
        FirebaseApp.configure()

        // Configure Google Sign-In with your client ID.
        // This client ID must be your REVERSED_CLIENT_ID from your GoogleService-Info.plist.
        // Example: "com.googleusercontent.apps.1234567890-abcdefghijklmnop"
        // Ensure that the value below exactly matches your REVERSED_CLIENT_ID.
        GIDSignIn.sharedInstance.clientID = "com.googleusercontent.apps.103072032496-eshh54us7j8mriv22ebu0iberhqb4j15"

        // *** ESSENTIAL for Capacitor ***
        // This call ensures that Capacitor's core and its plugins are properly initialized
        // when your application launches. Do not remove this.
        ApplicationDelegateProxy.shared.application(application, didFinishLaunchingWithOptions: launchOptions)

        return true
    }

    // This method is called when your app receives a URL, which is vital for
    // handling redirects from Google Sign-In and other deep links/URL schemes.
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // First, attempt to handle the URL with Google Sign-In.
        // If GIDSignIn.sharedInstance.handle(url) returns true, it means Google Sign-In
        // has processed its specific redirect URL. In this case, we're done,
        // and we return true.
        let googleHandled = GIDSignIn.sharedInstance.handle(url)

        if googleHandled {
            return true
        }

        // If the URL was not handled by Google Sign-In, pass it to Capacitor's
        // ApplicationDelegateProxy. This allows other Capacitor plugins (like App, Browser,
        // or any custom plugins handling URL schemes) to process the URL.
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    // This method is for handling Universal Links (also known as iOS Universal Links or Deep Links).
    // It's important for Capacitor plugins that might use Universal Links (e.g., App, Browser, etc.).
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Pass the user activity to Capacitor's ApplicationDelegateProxy
        // to ensure Universal Links are processed correctly by Capacitor plugins.
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    // MARK: - App Lifecycle Methods (Optional, can be left as is or removed if unused)
    // These are standard AppDelegate lifecycle methods that you can use for
    // pausing tasks, saving data, etc., as your app changes states.
    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state.
        // This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message)
        // or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks.
        // Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers,
        // and store enough application state information to restore your application to its
        // current state in case it is terminated later.
        // If your application supports background execution, this method is called instead
        // of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state;
        // here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive.
        // If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate.
        // See also applicationDidEnterBackground:.
    }
}