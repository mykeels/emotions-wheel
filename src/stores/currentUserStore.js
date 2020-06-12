import { observable, computed, flow } from 'mobx';
import { useStaticRendering } from 'mobx-react-lite';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(typeof window === 'undefined');

let store;

class CurrentUserStore {
  @observable userData = null;
  @observable state = 'loading';

  fetchUser = flow(function* () {
    this.userData = null;
    this.state = 'loading';

    try {
      const res = yield fetch('/api/user');

      this.state = 'done';

      const json = yield res.json();

      this.userData = json.user;
    } catch (error) {
      this.state = 'error';
    }
  });

  logIn = flow(function* (body) {
    this.state = 'logging in';

    const res = yield fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const resJson = yield res.json();

    this.state = 'done';

    switch (res.status) {
      case 200:
        console.log('logged in!', resJson);
        this.userData = resJson.user;

        return res;
      default:
        throw new Error({ status: res.status, json: resJson });
    }
  });

  logOut = flow(function* () {
    this.state = 'logging out';

    try {
      console.log('logging out...');
      yield fetch('/api/auth', {
        method: 'DELETE',
      });
      console.log('logged out!');

      this.userData = null;
      this.state = 'done';
    } catch (error) {
      this.state = 'error';
    }
  });

  @computed({ keepAlive: true })
  get isLoading() {
    return this.state === 'loading';
  }

  @computed({ keepAlive: true })
  get isLoggingOut() {
    return this.state === 'logging out';
  }

  @computed({ keepAlive: true })
  get isLoggedIn() {
    return this.userData !== null;
  }

  @computed({ keepAlive: true })
  get currentUser() {
    return this.userData;
  }
}

function initializeStore() {
  const _store = store ?? new CurrentUserStore();

  _store.fetchUser();

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;

  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

export function createCurrentUserStore() {
  return initializeStore();
}
