from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import books, categories, members, loans, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(categories.router)
app.include_router(members.router)
app.include_router(loans.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "Library Management System API is running"}