export const natssWrapper = {
  client: {
    publish:
      // (subject: string, data: string, callback: () => void) => { callback() }
      jest.fn().mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback()
        }
      )
  }
}
