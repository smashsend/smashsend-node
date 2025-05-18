declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchObject(expected: any): R;
    }

    type Mocked<T> = {
      [P in keyof T]: T[P] extends (...args: any[]) => any
        ? jest.Mock<ReturnType<T[P]>, Parameters<T[P]>>
        : T[P];
    } & T;
  }
}

export {};
