export class DataGovAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
    public endpoint?: string
  ) {
    super(message)
    this.name = 'DataGovAPIError'
  }
}
