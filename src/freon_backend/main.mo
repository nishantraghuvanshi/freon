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

  // Helper function to update post in array
  func updatePostInArray(posts: [Post], targetIndex: Nat, updatedPost: Post) : [Post] {
    Array_.tabulate<Post>(posts.size(), func(i) = if (i == targetIndex) updatedPost else posts[i])
  };

  // Helper function to update comment in array  
  func updateCommentInArray(comments: [Comment], targetIndex: Nat, updatedComment: Comment) : [Comment] {
    Array_.tabulate<Comment>(comments.size(), func(i) = if (i == targetIndex) updatedComment else comments[i])
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
    image_url: Text;
    timestamp: Time.Time;
    likes: [Principal];
    comments_count: Nat;
  };

  type Comment = {
    id: Nat;
    post_id: Nat;
    author: Principal;
    content: Text;
    timestamp: Time.Time;
    parent_comment_id: ?Nat; // For nested replies
    likes: [Principal];
  };

  // Stable storage
  stable var usersStore : [(Principal, UserProfile)] = [];
  stable var followingStore : [(Principal, [Principal])] = [];
  stable var postsStore : [Post] = [];
  stable var commentsStore : [Comment] = [];
  stable var _notificationsStore : [Text] = []; // Simplified to avoid migration issues

  // In-memory storage
  var users = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
  var following = HashMap.HashMap<Principal, [Principal]>(10, Principal.equal, Principal.hash);
  var posts : [Post] = [];
  var comments : [Comment] = [];
  var postId : Nat = 0;
  var commentId : Nat = 0;

  // Upgrade hooks
  system func preupgrade() {
    usersStore := Iter.toArray(users.entries());
    followingStore := Iter.toArray(following.entries());
    postsStore := posts;
    commentsStore := comments;
  };
  system func postupgrade() {
    users := HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
    for ((p, u) in usersStore.vals()) { users.put(p, u); };
    following := HashMap.HashMap<Principal, [Principal]>(10, Principal.equal, Principal.hash);
    for ((p, f) in followingStore.vals()) { following.put(p, f); };
    posts := postsStore;
    comments := commentsStore;
    postId := if (posts.size() == 0) 0 else posts[posts.size()-1].id + 1;
    commentId := if (comments.size() == 0) 0 else comments[comments.size()-1].id + 1;
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
    if (arrayContains<Principal>(arr, target, Principal.equal)) {
      return false; // Already following
    } else {
      let newArr = Array_.append<Principal>(arr, [target]);
      following.put(caller, newArr);
      return true;
    };
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
  public func create_post(caller: Principal, content: Text, image_url: Text) : async Bool {
    if (users.get(caller) == null) { return false; };
    let newPost : Post = {
      id = postId;
      author = caller;
      content = content;
      image_url = image_url;
      timestamp = Time.now();
      likes = [];
      comments_count = 0;
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

  // ========== LIKES SYSTEM ==========
  
  // Like a post
  public func like_post(caller: Principal, post_id: Nat) : async Bool {
    if (users.get(caller) == null) { return false; };
    
    let postIndex = Array_.find<Nat>(Array_.tabulate<Nat>(posts.size(), func(i) = i), func(i) = posts[i].id == post_id);
    switch (postIndex) {
      case null { return false; };
      case (?index) {
        let post = posts[index];
        if (arrayContains<Principal>(post.likes, caller, Principal.equal)) {
          return false; // Already liked
        };
        let updatedPost = {
          id = post.id;
          author = post.author;
          content = post.content;
          image_url = post.image_url;
          timestamp = post.timestamp;
          likes = Array_.append<Principal>(post.likes, [caller]);
          comments_count = post.comments_count;
        };
        posts := updatePostInArray(posts, index, updatedPost);
        return true;
      };
    };
  };

  // Unlike a post
  public func unlike_post(caller: Principal, post_id: Nat) : async Bool {
    let postIndex = Array_.find<Nat>(Array_.tabulate<Nat>(posts.size(), func(i) = i), func(i) = posts[i].id == post_id);
    switch (postIndex) {
      case null { return false; };
      case (?index) {
        let post = posts[index];
        if (not arrayContains<Principal>(post.likes, caller, Principal.equal)) {
          return false; // Not liked
        };
        let updatedPost = {
          id = post.id;
          author = post.author;
          content = post.content;
          image_url = post.image_url;
          timestamp = post.timestamp;
          likes = Array_.filter<Principal>(post.likes, func(p) = p != caller);
          comments_count = post.comments_count;
        };
        posts := updatePostInArray(posts, index, updatedPost);
        return true;
      };
    };
  };

  // Get post likes
  public query func get_post_likes(post_id: Nat) : async [Principal] {
    switch (Array_.find<Post>(posts, func(p) = p.id == post_id)) {
      case null { []; };
      case (?post) { post.likes; };
    };
  };

  // ========== COMMENTS SYSTEM ==========
  
  // Create a comment
  public func create_comment(caller: Principal, post_id: Nat, content: Text, parent_comment_id: ?Nat) : async ?Nat {
    if (users.get(caller) == null) { return null; };
    
    // Check if post exists
    switch (Array_.find<Post>(posts, func(p) = p.id == post_id)) {
      case null { return null; };
      case (?post) {
        let newComment : Comment = {
          id = commentId;
          post_id = post_id;
          author = caller;
          content = content;
          timestamp = Time.now();
          parent_comment_id = parent_comment_id;
          likes = [];
        };
        comments := Array_.append<Comment>(comments, [newComment]);
        
        // Update post comments count
        var postIndex : ?Nat = null;
        for (i in posts.keys()) {
          if (posts[i].id == post_id) {
            postIndex := ?i;
          };
        };
        switch (postIndex) {
          case (?index) {
            let updatedPost = {
              id = post.id;
              author = post.author;
              content = post.content;
              image_url = post.image_url;
              timestamp = post.timestamp;
              likes = post.likes;
              comments_count = post.comments_count + 1;
            };
            posts := updatePostInArray(posts, index, updatedPost);
          };
          case null {};
        };
        
        commentId := commentId + 1;
        return ?newComment.id;
      };
    };
  };

  // Get comments for a post
  public query func get_post_comments(post_id: Nat) : async [Comment] {
    Array_.filter<Comment>(comments, func(c) = c.post_id == post_id)
  };

  // Like a comment
  public func like_comment(caller: Principal, comment_id: Nat) : async Bool {
    if (users.get(caller) == null) { return false; };
    
    let commentIndex = Array_.find<Nat>(Array_.tabulate<Nat>(comments.size(), func(i) = i), func(i) = comments[i].id == comment_id);
    switch (commentIndex) {
      case null { return false; };
      case (?index) {
        let comment = comments[index];
        if (arrayContains<Principal>(comment.likes, caller, Principal.equal)) {
          return false; // Already liked
        };
        let updatedComment = {
          id = comment.id;
          post_id = comment.post_id;
          author = comment.author;
          content = comment.content;
          timestamp = comment.timestamp;
          parent_comment_id = comment.parent_comment_id;
          likes = Array_.append<Principal>(comment.likes, [caller]);
        };
        comments := updateCommentInArray(comments, index, updatedComment);
        return true;
      };
    };
  };

  // Unlike a comment
  public func unlike_comment(caller: Principal, comment_id: Nat) : async Bool {
    let commentIndex = Array_.find<Nat>(Array_.tabulate<Nat>(comments.size(), func(i) = i), func(i) = comments[i].id == comment_id);
    switch (commentIndex) {
      case null { return false; };
      case (?index) {
        let comment = comments[index];
        if (not arrayContains<Principal>(comment.likes, caller, Principal.equal)) {
          return false; // Not liked
        };
        let updatedComment = {
          id = comment.id;
          post_id = comment.post_id;
          author = comment.author;
          content = comment.content;
          timestamp = comment.timestamp;
          parent_comment_id = comment.parent_comment_id;
          likes = Array_.filter<Principal>(comment.likes, func(p) = p != caller);
        };
        comments := updateCommentInArray(comments, index, updatedComment);
        return true;
      };
    };
  };

  // ========== NOTIFICATIONS SYSTEM ==========
  
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
