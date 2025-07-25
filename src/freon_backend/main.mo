import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor class() {
  // User profile type
  type UserProfile = {
    username: Text;
    bio: Text;
    image_url: Text;
    created_at: Time.Time
  };

  // Storage for user profiles
  var users = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);

  // Register a new user (caller principal)
  public func register_user(caller: Principal, username: Text, bio: Text, image_url: Text) : async Bool {
    if (users.get(caller) != null) {
      // Already registered
      return false;
    } else {
      let profile : UserProfile = {
        username = username;
        bio = bio;
        image_url = image_url;
        created_at = Time.now();
      };
      users.put(caller, profile);
      return true;
    }
  };

  // Get a user profile by principal
  public query func get_user(p: Principal) : async ?UserProfile {
    users.get(p)
  };

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
}
