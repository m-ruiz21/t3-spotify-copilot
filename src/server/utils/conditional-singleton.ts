let globalSingletons: { [key: string]: any } = {};

/**
 * Returns a new instance of the provided type if the environment is production. 
 * Otherwise, it checks if an instance of the type already exists. If it does, it returns that instance. 
 * If it doesn't, it creates a new instance, stores it, and returns it.
 * 
 * The instances are stored in a global object `globalSingletons` which is a map where the keys are the names of the types and the values are the instances.
 * 
 * @example 
 * 
 * ```typescript
 * import { ConditionalSingleton } from './conditional-singleton';
 * 
 * class MyClass { }
 * 
 * const myClassInstance = ConditionalSingleton(MyClass);
 * ```
 * 
 * In the above example, `myClassInstance` will be a new instance of `MyClass` if the environment is production. 
 * Otherwise, it will be a singleton instance of `MyClass`.
 */
export function ConditionalSingleton<T>(type: { new(): T ;} ): T {
    if (process.env.NODE_ENV == 'production'){
        return new type();
    }
    
    const typeName = type.name;
    if (!globalSingletons[typeName]) {
        globalSingletons[typeName] = new type();
    }

    return globalSingletons[typeName];
}