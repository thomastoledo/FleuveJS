export class Observable {
    constructor(...args) {
      let values = args;
  
      const subscribers = [];
  
      this.next = (...vals) => {
        values = vals;
        subscribers.forEach((f) => f(...values));
      };
  
      this.subscribe = (f) => {
        subscribers.push(f);
        f(...values);
      };
  
      this.pipe = (...functions) => {
        // on filtre les fonctions
        const fns = filterNonFunctions(...functions);
        const obs = new Observable();
        // s'il en reste, alors on les exécute les unes à la suite des autres
        if (fns.length > 0) {
          const res = fns.slice(1).reduce((val, fn) => fn(val), fns[0](...values));
          obs.next(res);
        }
        // on retourne l'Observable
        return obs;
      };
  
      const filterNonFunctions = (...fns) => {
        return fns.filter((f) => typeof f === 'function');
      }
    }
  }
  