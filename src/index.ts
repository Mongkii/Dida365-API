import axios from 'axios';

enum TaskKind {
  TEXT = 'TEXT',
}

enum TaskStatus {
  UNDONE,
}

interface Task {
  title: string;
  projectId: string;
  isAllDay: boolean;
  isFloating: boolean;
  kind: TaskKind;
  parentId?: string;
  status: TaskStatus;
}

class Dida365API {
  cookie: string[];
  tasks: Task[];

  constructor(cookie: string[], tasks: Task[]) {
    this.cookie = cookie;
    this.tasks = tasks;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  static async init(username: string, password: string) {
    const loginResp = await axios.post(
      'https://api.dida365.com/api/v2/user/signon',
      { username, password },
      { params: { wc: true, remember: true } }
    );
    const cookie = loginResp.headers?.['set-cookie'];

    if (!Array.isArray(cookie)) {
      throw Error('Login failed.');
    }

    const tasksResp = await axios.get('https://api.dida365.com/api/v2/batch/check/0', {
      headers: { cookie },
    });
    if (tasksResp.status !== 200) {
      throw Error('Fetch tasks data failed.');
    }

    const tasks = tasksResp.data.syncTaskBean?.update || [];

    return new Dida365API(cookie, tasks);
  }
}

export default Dida365API;
