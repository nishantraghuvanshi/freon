import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Option "mo:base/Option";
import Array "mo:base/Array";

actor class() {
  let Array_ = Array;
  
  // Helper function for array contains
  func arrayContains<T>(arr: [T], val: T, eq: (T, T) -> Bool) : Bool {
    for (x in arr.vals()) {
      if (eq(x, val)) return true;
    };
    false
  };

  // User profile type
  type UserProfile = {
    username: Text;
    bio: Text;
    image_url: Text;
    created_at: Time.Time;
  };
  type Post = {
    id: Nat;
    author: Principal;
    content: Text;
    timestamp: Time.Time;
  };

  // Stable storage
  stable var usersStore : [(Principal, UserProfile)] = [];
  stable var followingStore : [(Principal, [Principal])] = [];
  stable var postsStore : [Post] = [];

  // In-memory storage
  var users = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
  var following = HashMap.HashMap<Principal, [Principal]>(10, Principal.equal, Principal.hash);
  var posts : [Post] = [];
  var postId : Nat = 0;

  // Upgrade hooks
  system func preupgrade() {
    usersStore := Iter.toArray(users.entries());
    followingStore := Iter.toArray(following.entries());
    postsStore := posts;
  };
  system func postupgrade() {
    users := HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
    for ((p, u) in usersStore.vals()) { users.put(p, u); };
    following := HashMap.HashMap<Principal, [Principal]>(10, Principal.equal, Principal.hash);
    for ((p, f) in followingStore.vals()) { following.put(p, f); };
    posts := postsStore;
    postId := if (posts.size() == 0) 0 else posts[posts.size()-1].id + 1;
  };

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

  // Update user profile (only for the caller)
  public func update_user_profile(caller: Principal, username: Text, bio: Text, image_url: Text) : async Bool {
    switch (users.get(caller)) {
      case null { return false };
      case (?profile) {
        let updated : UserProfile = {
          username = username;
          bio = bio;
          image_url = image_url;
          created_at = profile.created_at;
        };
        users.put(caller, updated);
        return true;
      }
    }
  };

  // Get a user profile by principal
  public query func get_user(p: Principal) : async ?UserProfile {
    users.get(p)
  };

  // Get all users
  public query func get_all_users() : async [(Principal, UserProfile)] {
    Iter.toArray(users.entries())
  };

  // Social graph: follow
  public func follow(caller: Principal, target: Principal) : async Bool {
    if (caller == target) { return false; };
    if (users.get(caller) == null or users.get(target) == null) { return false; };
    let curr = following.get(caller);
    let arr = Option.get(curr, []);
    let updated = if (arrayContains<Principal>(arr, target, Principal.equal)) {
      arr
    } else {
      Array_.append<Principal>(arr, [target])
    };
    following.put(caller, updated);
    return true;
  };

  // Social graph: unfollow
  public func unfollow(caller: Principal, target: Principal) : async Bool {
    let curr = following.get(caller);
    let arr = Option.get(curr, []);
    if (arr.size() == 0) { return false; };
    let filtered = Array_.filter<Principal>(arr, func(x) = x != target);
    following.put(caller, filtered);
    return true;
  };

  // Get following
  public query func get_following(p: Principal) : async [Principal] {
    Option.get(following.get(p), [])
  };

  // Get followers
  public query func get_followers(p: Principal) : async [Principal] {
    let entries = Iter.toArray(following.entries());
    let buf = Buffer.Buffer<Principal>(10);
    for (i in entries.vals()) {
      let (user, arr) = i;
      if (arrayContains<Principal>(arr, p, Principal.equal)) {
        buf.add(user);
      }
    };
    Buffer.toArray(buf)
  };

  // Create a post
  public func create_post(caller: Principal, content: Text) : async Bool {
    if (users.get(caller) == null) { return false; };
    let newPost : Post = {
      id = postId;
      author = caller;
      content = content;
      timestamp = Time.now();
    };
    posts := Array_.append<Post>(posts, [newPost]);
    postId := postId + 1;
    return true;
  };

  // Get posts by user
  public query func get_posts_by_user(p: Principal) : async [Post] {
    Array_.filter<Post>(posts, func(post) = post.author == p)
  };

  // Get all posts
  public query func get_all_posts() : async [Post] {
    posts
  };

  // Get personalized feed (posts from followed users)
  public query func get_feed(p: Principal) : async [Post] {
    let followedUsers = Option.get(following.get(p), []);
    Array_.filter<Post>(posts, func(post) = arrayContains<Principal>(followedUsers, post.author, Principal.equal))
  };

  // Insert dummy users for development
  public func insert_dummy_users() : async () {
    let now = Time.now();
    let dummy1 = {
      username = "alice";
      bio = "I love Motoko!";
      image_url = "https://api.dicebear.com/7.x/pixel-art/svg?seed=alice";
      created_at = now;
    };
    let dummy2 = {
      username = "bob";
      bio = "DFINITY enthusiast.";
      image_url = "https://api.dicebear.com/7.x/pixel-art/svg?seed=bob";
      created_at = now;
    };
    let dummy3 = {
      username = "carol";
      bio = "Open web advocate.";
      image_url = "https://api.dicebear.com/7.x/pixel-art/svg?seed=carol";
      created_at = now;
    };
    let p1 = Principal.fromText("anlbb-mrnr5-ic4zz-vppjt-ruov7-mlrou-vkgbn-widdx-2lzty-b7ncy-gqe");
    let p2 = Principal.fromText("anlbb-mrnr5-ic4zz-vppjt-ruov7-mlrou-vkgbn-widdx-2lzty-b7ncy-gqe");
    let p3 = Principal.fromText("anlbb-mrnr5-ic4zz-vppjt-ruov7-mlrou-vkgbn-widdx-2lzty-b7ncy-gqe");
    users.put(p1, dummy1);
    users.put(p2, dummy2);
    users.put(p3, dummy3);
  };

  // Call insert_dummy_users in init for dev/demo
  public func init_dummy_data() : async () {
    await insert_dummy_users();
  };

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  }
}
