const router = require('express').Router();
const {GetAllDBTasks, newTask, GetOneDBTask, DeleteOneDBTask, UpdateOneDBTask} = require('../controller/tasksController');


router.route('/tasks').get(GetAllDBTasks).post(newTask);
router.route('/tasks/:id').get(GetOneDBTask).delete(DeleteOneDBTask).put(UpdateOneDBTask);


module.exports = router