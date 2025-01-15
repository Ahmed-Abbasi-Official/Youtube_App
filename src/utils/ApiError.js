class ApiError extends Error {
  constructor(
    message = "SomeThing went wrong",
    errors = [],
    statusCode,
    stack = ""
  ) {
    super(message);
    this.statusCode=statusCode;
    this.data=null;
    this.message=message;
    this.success=false;
    this.errors= errors;
  }
}
