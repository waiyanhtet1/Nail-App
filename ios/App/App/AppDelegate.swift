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
        // Capacitor 7 URL handling
        let capacitorHandled = BridgePluginManager.shared.handleOpenUrl(app, url, options)

        // Google Sign-In handler
        let googleHandled = GIDSignIn.sharedInstance.handle(url)

        return capacitorHandled || googleHandled
    }

    func application(_ application: UIApplication,
                     continue userActivity: NSUserActivity,
                     restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return BridgePluginManager.shared.handleContinueActivity(application, userActivity, restorationHandler)
    }
}
