import UIKit
import Capacitor
import FirebaseCore // <-- New import
import GoogleSignIn // <-- New import


@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure() // <-- Essential for Firebase
        
        // This line is correct for initializing Google Sign-In
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: "com.googleusercontent.apps.103072032496-eshh54us7j8mriv22ebu0iberhqb4j15") 
        
        return true
    }
    
    // IMPORTANT: You also need this method to handle URL callbacks for Google Sign-In
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // Handle URL for Google Sign-In
        var handled: Bool
        handled = GIDSignIn.sharedInstance.handle(url)
        if handled {
            return true
        }

        // Handle other custom URL types from Capacitor if needed
        if CAPBridge.handleOpenUrl(url, options) {
            return true
        }

        return false
    }

    // You might also need this for Universal Links (Firebase Dynamic Links, etc.)
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        if CAPBridge.handleContinueActivity(userActivity, restorationHandler) {
            return true
        }
        return false
    }
}