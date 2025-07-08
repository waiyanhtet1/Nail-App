import UIKit
import Capacitor
import FirebaseCore
import GoogleSignIn


@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        
        // UNCOMMENT AND ENSURE THIS LINE IS ACTIVE:
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: "com.googleusercontent.apps.103072032496-eshh54us7j8mriv22ebu0iberhqb4j15") 

        return true
    }

    // ... (other application lifecycle methods) ...

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Handle URL for Google Sign-In FIRST
        var handled: Bool
        handled = GIDSignIn.sharedInstance.handle(url)
        if handled {
            return true
        }

        // Then let Capacitor handle other URLs
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Let Capacitor handle Universal Links
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}