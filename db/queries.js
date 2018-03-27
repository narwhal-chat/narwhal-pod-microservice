const promise = require('bluebird');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/narwhal_pods';
const db = pgp(connectionString);

const pods = {
  // Return all pods that a user belongs to
  getPodsForUser: async (userId) => {
    try {
      const pods = await db.any('SELECT p.* FROM pod_user pu, pod p WHERE pu.pod_id = p.id AND pu.user_id = ${userId}', { userId: userId });
      return pods;
    } catch (e) {
      console.log(e);
    }
  },
  // Create a pod
  createPod: (newPod) => {
    console.log('newPod', newPod);
    const response = db.tx(async t => {
      const pod = await t.one('INSERT INTO pod(reference_name, display_name, description, avatar, pod_category_id, author_id) ' +
          'VALUES(${referenceName}, ${displayName}, ${description}, ${avatar}, ${podCategoryId}, ${authorId}) ' +
          'RETURNING id',
        {
          referenceName: newPod.referenceName,
          displayName: newPod.displayName,
          description: newPod.description,
          avatar: newPod.avatar,
          podCategoryId: newPod.podCategoryId,
          authorId: newPod.userId
        });

      const topic = await t.one('INSERT INTO topic(name, pod_id, author_id) ' +
          'VALUES(${name}, ${podId}, ${authorId}) ' +
          'RETURNING id, name',
        {
          name: 'general',
          podId: pod.id,
          authorId: newPod.userId
        });
      
      return await t.one('INSERT INTO pod_user(pod_id, user_id, is_admin) ' +
          'VALUES(${podId}, ${userId}, ${isAdmin}) ' +
          'RETURNING id, is_admin',
        {
          podId: pod.id,
          userId: newPod.userId,
          isAdmin: true
        });
    })
      .then(data => {
        console.log('data', data);

      })
      .catch(error => {
        console.log('Error', error);
      });
  },
  // Return all topics for a pod
  getAllTopicsInPod: async (podId) => {
    try {
      const topics = await db.any('SELECT t.* FROM topic t, pod p WHERE t.pod_id = p.id AND p.id = ${podId}', { podId: podId });
      return topics;
    } catch (e) {
      console.log(e);
    }
  },
  createTopic: async (newTopic) => {
    try {
      const topic = await db.one('INSERT INTO topic(name, pod_id, author_id) ' +
          'VALUES(${name}, ${podId}, ${authorId}) ' +
          'RETURNING id, name', 
        {
          name: newTopic.name,
          podId: newTopic.podId,
          authorId: newTopic.userId
        })
        console.log(topic);
      return topic;
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports = {
  pods: pods
};