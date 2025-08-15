
export const createRouter = (store) => {
 
  const getRoute = () => {
    const hash = window.location.hash;
    switch (hash) {
      case '#/active':
        return 'active';
      case '#/completed':
        return 'completed';
      default:
        return 'all';
    }
  };

  
  const handleHashChange = () => {
    const route = getRoute();
    store.dispatch({
      type: 'SET_FILTER',
      payload: route,
    });
  };

 
  window.onhashchange = handleHashChange;

  handleHashChange();
};
