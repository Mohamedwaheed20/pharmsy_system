
export const errorHandler = (api) => {
    return (req, res, next) => {
      api(req, res, next).catch((error) => {
        console.log(`Error in ${req.url} from errorHandler middleware`, error);
        return next(new Error(error.message, { cause: 500 }));
      });
    };
  };
  
  export const globalErrorHandler = (error, req, res, next) => {
    // لو الـ error فيه statusCode هنستخدمه وإلا 500
    const statusCode = error.statusCode || error.cause || 500;
  
    console.error(
      `Global error handler: ${req.method} ${req.url} - ${error.message}`
    );
  
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Something went wrong',
      // في الـ dev ممكن تبعت stack للـ debugging
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  };
  