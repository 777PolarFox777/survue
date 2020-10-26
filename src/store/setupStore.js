import Vuex from "vuex";

const completeAssign = (target, ...sources) => {
  sources.forEach((source) => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});
    Object.defineProperties(target, descriptors);
  });

  return target;
};

const makeNamespaced = (config) => {
  return {
    ...config,
    modules: Object.entries(config.modules).reduce((acc, [key, value]) => {
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

const getState = (store, name, module) => {
  const moduleState = Object.keys(module.state).reduce((acc, stateName) => {
    Object.defineProperty(acc, stateName, {
      enumerable: true,
      get: () => {
        return store.state[name][stateName];
      }
    });

    return acc;
  }, {});

  const gettersState = Object.keys(module.getters).reduce((acc, getterName) => {
    Object.defineProperty(acc, getterName, {
      enumerable: true,
      get: () => {
        return store.getters[`${name}/${getterName}`]
      }
    });

    return acc;
  }, {});

  return completeAssign({}, moduleState, gettersState);
}

const getActions = (store, name, module) => {
  const mutations = Object.keys(module.mutations).reduce((acc, mutationName) => {
    return {
      [mutationName](payload) {
        store.commit(`${name}/${mutationName}`, payload);
      },
      ...acc,
    }
  }, {});

  const actions = Object.keys(module.actions).reduce((acc, actionName) => {
    return {
      [actionName](payload) {
        store.dispatch(`${name}/${actionName}`, payload);
      },
      ...acc,
    }
  }, {});

  return {
    ...mutations,
    ...actions,
  };
}

export const setupStore = (config) => {
  const namespacedConfig = makeNamespaced(config);

  const store = new Vuex.Store(namespacedConfig);
  const moduleBindings = Object.entries(config.modules).reduce((acc, item) => {
    const [moduleName, moduleValue] = item;

    return {
      [moduleName]: completeAssign({}, getState(store, moduleName, moduleValue), getActions(store, moduleName, moduleValue)),
      ...acc,
    };
  }, {});

  return completeAssign(store, moduleBindings);
};
