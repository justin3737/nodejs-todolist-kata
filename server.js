const http = require('http');
const headers = require('./headers.js');
const { v4: uuidv4 } = require('uuid');
const { successHandler, errorHandler } = require('./handler.js');

const todos = [];

const reqlisener = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  })

  if (req.url === '/todos'&& req.method === 'GET') {
    successHandler(res, todos);
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', ()=>{
      try{
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          todos.push({
            id: uuidv4(),
            title
          });
          successHandler(res, todos);
        } else {
          errorHandler(res, '欄位名稱不正確');
        }
      }catch(error){
        errorHandler(res, '新增資料失敗');
      }
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    successHandler(res, '刪除所有資料成功');
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const todoID = req.url.split('/').pop();
    const todosID = todos.findIndex(item => item.id === todoID);
    if (todoID !== -1) {
      todos.splice(todosID, 1);
      successHandler(res, '刪除資料成功');
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', ()=>{
      try{
        const toDoTitle = JSON.parse(body).title;
        const toDoID = req.url.split('/').pop();
        const toDoIndex = todos.findIndex(item => item.id === toDoID);
        if( toDoTitle !== undefined && toDoIndex !== -1) {
          todos[toDoIndex].title = toDoTitle;
          successHandler(res,'更新資料成功');
        } else {
          errorHandler(res, '欄位名稱不正確或是無此ID');
        }
      }catch{
        errorHandler(res, '編輯資料失敗！')
      }
    });
  } else if (req.url === '/todos' && req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.write('OPTIONS');
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write('無此頁面');
    res.end();
  }
}

const server = http.createServer(reqlisener);
server.listen(process.env.PORT || 3005);

