const promise = require('bluebird');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/narwhal_pods';
const db = pgp(connectionString);

const pods = {
  createPod: ({referenceName, displayName, description, avatar, podCategoryId, userId}) => {
    const response = db.tx(async t => {
      const pod = await t.one('INSERT INTO pod(reference_name, display_name, description, avatar, pod_category_id, author_id) ' +
          'VALUES(${referenceName}, ${displayName}, ${description}, ${avatar}, ${podCategoryId}, ${authorId}) ' +
          'RETURNING id',
        {
          referenceName: referenceName,
          displayName: displayName,
          description: description,
          avatar: avatar,
          podCategoryId: podCategoryId,
          authorId: userId
        });

      const topic = await t.one('INSERT INTO topic(name, pod_id, author_id) ' +
          'VALUES(${name}, ${podId}, ${authorId}) ' +
          'RETURNING id, name',
        {
          name: 'general',
          podId: pod.id,
          authorId: userId
        });
      
      return await t.one('INSERT INTO pod_user(pod_id, user_id, is_admin) ' +
          'VALUES(${podId}, ${userId}, ${isAdmin}) ' +
          'RETURNING id, is_admin',
        {
          podId: pod.id,
          userId: userId,
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
  getPodsForUser: async (userId) => {
    try {
      const pods = await db.any('SELECT * FROM pod_user pu, pod p WHERE pu.pod_id = p.id AND pu.user_id = ${userId}', { userId: userId });
      return pods;
    } catch (e) {
      console.log(e);
    }
  }
};

const topics = {
};

module.exports = {
  pods: pods,
  topics: topics
};