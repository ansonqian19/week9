// Goal: Provide a function to "like" a post in Firebase
// Requirement: "Likes" are user-specific – a user can "like" a post, but only once.
// Currently, the "number of likes" on a post isn't user-specific, nor does it prevent an
// unlimited number of likes. How would we expand/refactor our domain model to support this?

// allows us to use firebase
let firebase = require(`./firebase`)

exports.handler = async function(event) {

  // write the recipe and the implementation
  // record the post id
  let postId = event.queryStringParameters.postId
  let userId = event.queryStringParameters.userId
  
  
  // establish a connection to firebase in memory
  let db = firebase.firestore()

  // read the collection
  let likeQuery =await db.collection(`likes`).where(`postId`,`==`,postId).where(`userId`,`==`,userId).get()
  let likes = likeQuery.docs

  // make sure the new user id is not stored before
  if (likes.length == 0){

  // record the users who liked
  await db.collection('likes').add({
    postId: postId,
    userId: userId 
  })

  // add 1 to numOfLikes
  await db.collection('posts').doc(postId).update({
    numOfLikes: firebase.firestore.FieldValue.increment(1)
  })
} else {
  // get the like id
  likeId = likes[0].id
  
  // delete the like in database
  await db.collection('likes').doc(likeId).delete()
  
  //decrease number of likes
  await db.collection('posts').doc(postId).update({
    numOfLikes: firebase.firestore.FieldValue.increment(-1)
  })
}
 
  return {
    statusCode: 200
  }
}