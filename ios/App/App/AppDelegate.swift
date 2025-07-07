import UIKit
import Capacitor
import FirebaseCore
import GoogleSignIn

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize Firebase
        FirebaseApp.configure()
        return true
    }

    func application(_ app: UIApplication,
                     open url: URL,
                     options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // Handle Google Sign-In callback
        if GIDSignIn.sharedInstance.handle(url) {
            return true
        }
        // Apple Sign-In does NOT require handling here with the plugin you're using
        return false
    }
}