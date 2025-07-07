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

    func application(_ app: UIApplication,
                     open url: URL,
                     options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // First let Capacitor handle the URL
        let capacitorHandled = CAPBridge.handleOpenUrl(app, url, options)

        // Then try Google Sign-In handler
        let googleHandled = GIDSignIn.sharedInstance.handle(url)

        return capacitorHandled || googleHandled
    }

    // Optional: support for universal links (e.g., Apple Sign-In)
    func application(_ application: UIApplication,
                     continue userActivity: NSUserActivity,
                     restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return CAPBridge.handleContinueActivity(application, userActivity, restorationHandler)
    }
}
