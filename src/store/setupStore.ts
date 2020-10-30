import Vuex from "vuex";

type SomeState = {
  [x: string]: any,
};

type SomeGetters = {
  [x: string]: any,
};

type SomeActions = {
  [x: string]: any,
};

type SomeModules<S = SomeState, G = SomeGetters, M = SomeGetters, A = SomeActions, D = any> = {
  [x: string]: VuexModule<S, G, M, A, D>,
}

type Params<T> = T extends (...x: infer R) => void ? R : never;

type GetSecondParam<T> = T extends (x: any, y: infer P) => any ? P : never;

export interface VuexModule<S = SomeState, G = SomeGetters, M = SomeGetters, A = SomeActions, D = SomeModules> {
  state?: S,
  getters?: G,
  mutations?: M,
  actions?: A,
  modules?: D,
}

export interface VuexStore {
  state: {
    [x: string]: {
      [x: string]: any,
    }
  },
  getters: {
    [x: string]: (x: any) => any,
  }
  commit: (name: string, payload?: any) => any,
  dispatch: (name: string, payload?: any) => any,
}

type MappedStore<T extends VuexModule, M = T['modules']> = {
  [N in keyof M]: M[N] extends VuexModule
    ? {
      [K in keyof M[N]['state']]: M[N]['state'][K];
    } & {
      [K in keyof M[N]['getters']]: ReturnType<M[N]['getters'][K]>;
    } & {
      [K in keyof M[N]['mutations']]: (payload: Params<M[N]['mutations'][K]>[1]) => void
    } & {
      [K in keyof M[N]['actions']]: (payload: Params<M[N]['actions'][K]>[1]) => Promise<void>
    }
    : never;
}

const completeAssign = <T, U extends any[]>(target: T, sources: [...U]): T & [...U] => {
  sources.forEach((source) => {
    if (!source) {
      return;
    }

    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {} as Record<string, any>);
    Object.defineProperties(target, descriptors);
  });

  return target as T & U;
};

const makeNamespaced = (config: VuexModule) => {
  return {
    ...config,
    modules: config.modules && Object.entries(config.modules).reduce((acc, [key, value]) => {
      return {
        [key]: {
          namespaced: true,
          ...value,
        },
        ...acc,
      }
    }, {}),
  }
};

const getState = <S extends SomeState, G extends SomeGetters>(store: VuexStore, name: string, module: VuexModule<S, G>) => {
  const moduleState = module.state && Object.keys(module.state).reduce((acc, stateName) => {
    Object.defineProperty(acc, stateName, {
      enumerable: true,
      get: () => {
        return store.state[name][stateName];
      }
    });

    return acc;
  }, {} as { [K in keyof S]: S[K] });

  const gettersState = module.getters && Object.keys(module.getters).reduce((acc, getterName) => {
    Object.defineProperty(acc, getterName, {
      enumerable: true,
      get: () => {
        return store.getters[`${name}/${getterName}`]
      }
    });

    return acc;
  }, {} as { [K in keyof G]: ReturnType<G[K]> });

  return completeAssign({}, [moduleState, gettersState]);
}

const getActions = <M extends SomeGetters, A extends SomeActions>(store: VuexStore, name: string, module: VuexModule<any, any, M, A>) => {
  const mutations = module.mutations && Object.keys(module.mutations).reduce((acc, mutationName) => {
    return {
      [mutationName](payload: any) {
        store.commit(`${name}/${mutationName}`, payload);
      },
      ...acc,
    }
  }, {} as { [K in keyof M]: (payload: Params<M>[1]) => void });

  const actions = module.actions && Object.keys(module.actions).reduce((acc, actionName) => {
    return {
      [actionName](payload: any) {
        store.dispatch(`${name}/${actionName}`, payload);
      },
      ...acc,
    }
  }, {} as { [K in keyof A]: (payload: Params<A>[1]) => Promise<void> });

  return completeAssign({}, [mutations, actions]);
}

export const setupStore = <T extends VuexModule>(config: T): VuexStore & MappedStore<T> => {
  const namespacedConfig = makeNamespaced(config);

  const store = new Vuex.Store(namespacedConfig);

  if (!config.modules) {
    throw new Error('Modules are required in config!');
  }

  const moduleBindings = Object.entries(config.modules).reduce((acc, item) => {
    const [moduleName, moduleValue] = item;

    return {
      [moduleName]: completeAssign({}, [getState(store, moduleName, moduleValue), getActions(store, moduleName, moduleValue)]),
      ...acc,
    };
  }, {});

  return completeAssign(store, [moduleBindings]) as any;
};
