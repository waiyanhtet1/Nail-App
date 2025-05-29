import UIKit
import Capacitor
import FirebaseCore
import GoogleSignIn // <<< IMPORTANT: This import is essential for GIDSignIn to be recognized >>>

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.OpenURLOptionsKey: Any]?) -> Bool {
        // 1. Initialize Firebase
        // This is typically the first step to set up Firebase services in your app.
        FirebaseApp.configure()

        // 2. Configure Google Sign-In
        // For Google Sign-In SDK versions 5.0 and later, you must use GIDConfiguration.
        // Replace "com.googleusercontent.apps.103072032496-eshh54us7j8mriv22ebu0iberhqb4j15"
        // with your actual REVERSED_CLIENT_ID obtained from your GoogleService-Info.plist.
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: "com.googleusercontent.apps.103072032496-eshh54us7j8mriv22ebu0iberhqb4j15")

        // 3. Initialize Capacitor
        // This line is absolutely CRITICAL for Capacitor to set up its core
        // and initialize all your installed Capacitor plugins correctly at app launch.
        // The error "Extra argument 'didFinishLaunchingWithOptions'" is fixed by using
        // the correct label 'launchOptions:' as expected by Capacitor's proxy.
        ApplicationDelegateProxy.shared.application(application, launchOptions: launchOptions)

        return true
    }

    // This method is called when your app receives a URL. It's vital for:
    // - Handling redirects from Google Sign-In (OAuth flow).
    // - Processing deep links and custom URL schemes for other parts of your app or other plugins.
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // First, attempt to handle the URL with Google Sign-In.
        // The `handle()` method returns true if the URL was a Google Sign-In specific redirect.
        let googleHandled = GIDSignIn.sharedInstance.handle(url)

        // If Google Sign-In successfully processed the URL, we can stop here.
        if googleHandled {
            return true
        }

        // If the URL was NOT handled by Google Sign-In, pass it to Capacitor's
        // ApplicationDelegateProxy. This allows other Capacitor plugins (e.g., App, Browser,
        // or any custom plugins that handle URL schemes) to process it.
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    // This method is for handling Universal Links (also known as iOS Universal Links or Deep Links).
    // It's important for Capacitor plugins that might use Universal Links (e.g., sharing, app routing).
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Pass the user activity (which contains the Universal Link URL) to Capacitor's handler.
        // This ensures Universal Links are processed correctly by Capacitor plugins.
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    // MARK: - Optional App Lifecycle Methods
    // These are standard UIApplicationDelegate methods. You can keep them if you need
    // to perform specific actions when your app changes its lifecycle state (e.g., pauses, enters background).
    // If you don't need them, you can remove the empty implementations.

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state.
        // Use this method to pause ongoing tasks, disable timers, etc.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, etc., when the app enters background.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused while the application was inactive.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate.
    }
}