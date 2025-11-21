const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrimeTrade Assignment API',
      version: '1.0.0',
      description: 'API documentation for the E-commerce/Trading application',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
          },
        },
        Producer: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            businessName: { type: 'string' },
            email: { type: 'string' },
            location: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            inventory: { type: 'integer' },
            producerId: { type: 'integer' },
            categoryId: { type: 'integer' },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            total: { type: 'number' },
            paymentMethod: { type: 'string', enum: ['COD', 'PREPAID'] },
            paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'] },
            createdAt: { type: 'string', format: 'date-time' },
            OrderItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  productId: { type: 'integer' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                  status: { type: 'string', enum: ['pending', 'packed', 'shipped', 'delivered', 'cancelled'] },
                  Product: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      // User Orders
      '/api/orders/my': {
        get: {
          tags: ['Orders'],
          summary: 'Get my orders (User)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of orders',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Order' }
                  }
                }
              }
            }
          }
        }
      },
      '/api/orders/place': {
        post: {
          tags: ['Orders'],
          summary: 'Place a COD order from cart (User)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['addressId'],
                  properties: {
                    addressId: { type: 'integer' },
                    paymentMethod: { type: 'string', enum: ['COD'] }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Order placed successfully' }
          }
        }
      },
      '/api/orders/initiate-payment': {
        post: {
          tags: ['Orders'],
          summary: 'Initiate Razorpay payment for cart (User)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Payment initialized', content: { 'application/json': { schema: { type: 'object', properties: { razorpayOrderId: { type: 'string' }, amount: { type: 'number' } } } } } }
          }
        }
      },

      // Producer Order Management
      '/api/orders/producer': {
        get: {
          tags: ['Producer Orders'],
          summary: 'Get orders containing my products (Producer)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } }
          ],
          responses: {
            200: {
              description: 'List of orders',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      items: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            orderId: { type: 'integer' },
                            items: { type: 'array', items: { type: 'object' } } // Simplified
                          }
                        }
                      },
                      total: { type: 'integer' },
                      page: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/orders/{id}/status': {
        patch: {
          tags: ['Producer Orders'],
          summary: 'Update order status (Producer)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['pending', 'packed', 'shipped', 'delivered', 'cancelled'] }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Status updated' }
          }
        }
      },
      '/api/orders/producer/stats': {
        get: {
          tags: ['Producer Orders'],
          summary: 'Get order statistics (Producer)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Order stats',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      pending: { type: 'integer' },
                      delivered: { type: 'integer' },
                      revenue: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        }
      },

      '/api/users/signup': {
        post: {
          tags: ['Users'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Email already in use' },
          },
        },
      },
      '/api/users/signin': {
        post: {
          tags: ['Users'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { 
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'List all products',
          parameters: [
            { in: 'query', name: 'categoryId', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'offset', schema: { type: 'integer' } },
            { in: 'query', name: 'lat', schema: { type: 'number' }, description: 'User latitude for distance calculation' },
            { in: 'query', name: 'lon', schema: { type: 'number' }, description: 'User longitude for distance calculation' },
            { in: 'query', name: 'q', schema: { type: 'string' }, description: 'Search query' },
          ],
          responses: {
            200: {
              description: 'List of products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Products'],
          summary: 'Create a new product (Producer only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    inventory: { type: 'integer' },
                    categoryId: { type: 'integer' },
                    files: { type: 'array', items: { type: 'string', format: 'binary' } },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Product created successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/producer/signup': {
        post: {
          tags: ['Producers'],
          summary: 'Register a new producer',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'businessName'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    businessName: { type: 'string' },
                    phoneNumber: { type: 'string' },
                    description: { type: 'string' },
                    businessLogo: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Producer registered successfully' },
          },
        },
      },
      '/api/producer/signin': {
        post: {
          tags: ['Producers'],
          summary: 'Login producer',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
          },
        },
      },
      // Producer Analytics & Wallet
      '/api/producer/analytics': {
        get: {
          tags: ['Producer Dashboard'],
          summary: 'Get producer sales analytics and stats',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Analytics data retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      since: { type: 'string', format: 'date-time' },
                      series: { type: 'array', items: { type: 'object' } },
                      totals: { type: 'object', properties: { totalOrders: { type: 'integer' }, totalRevenue: { type: 'number' } } },
                      reviews: { type: 'object' },
                      payments: { type: 'object' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/producer/wallet/summary': {
        get: {
          tags: ['Producer Dashboard'],
          summary: 'Get producer wallet balance',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Wallet summary',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      balance: { type: 'number' },
                      currency: { type: 'string' },
                      updatedAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      
      '/api/admin/signin': {
        post: {
          tags: ['Admin Operations'],
          summary: 'Admin Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      admin: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          email: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      // Admin Dashboard & Operations
      '/api/admin/dashboard-stats': {
        get: {
          tags: ['Admin Dashboard'],
          summary: 'Get overall system statistics for admin',
          security: [{ bearerAuth: [] }], // Admin token required
          responses: {
            200: {
              description: 'Dashboard stats',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalOrders: { type: 'integer' },
                      pendingVerifications: { type: 'integer' },
                      disputes: { type: 'integer' },
                      chart: { type: 'array', items: { type: 'object' } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/admin/producers': {
        get: {
          tags: ['Admin Operations'],
          summary: 'List all producers',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of producers with status' }
          }
        }
      },
      '/api/admin/producers/{id}/approve': {
        post: {
          tags: ['Admin Operations'],
          summary: 'Approve a producer KYC',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Producer approved' }
          }
        }
      },
      '/api/admin/producers/{id}/reject': {
        post: {
          tags: ['Admin Operations'],
          summary: 'Reject a producer KYC',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    remarks: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Producer rejected' }
          }
        }
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs if you add comments later
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
