import UIKit
import Capacitor
import FirebaseCore
import GoogleSignIn

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        return true
    }

    // ✅ This handles Google Sign-In redirect
    func application(_ app: UIApplication,
                     open url: URL,
                     options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // First, let Capacitor handle it
        if let handled = CAPBridge.shared?.application(app, open: url, options: options), handled {
            return true
        }

        // Then try Google Sign-In (required for GoogleAuth plugin)
        return GIDSignIn.sharedInstance.handle(url)
    }
}