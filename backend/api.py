from decimal import Decimal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.BankAccount import BankAccount

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewAccount(BaseModel):
    name: str
    balance: Decimal = Decimal("0")


class Amount(BaseModel):
    amount: Decimal


def get_or_404(name):
    print("TRAZIM ACCOUNT:", name)
    account = BankAccount.find(name)
    if account is None:
        raise HTTPException(404, "Račun ne postoji.")
    return account



@app.get("/api/accounts")
def list_accounts():
    return [
        {
            "owner": account.name,
            "balance": account.balance
        }
        for account in BankAccount.show_all()
    ]

@app.get("/api/accounts/{name}")
def account_info(name: str):
    account = get_or_404(name)

    return {
        "owner": account.name,
        "balance": account.balance
    }


@app.post("/api/accounts")
def create_account(data: NewAccount):
    if BankAccount.find(data.name):
        raise HTTPException(409, "Račun za tog vlasnika već postoji.")
    account = BankAccount(data.name, data.balance)
    account.create_account()
    return {"owner": account.name, "balance": account.balance}


@app.post("/api/accounts/{name}/deposit")
def deposit(name: str, data: Amount):
    account = get_or_404(name)
    try:
        account.deposit(data.amount)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"owner": account.name, "balance": account.balance}


@app.post("/api/accounts/{name}/withdraw")
def withdraw(name: str, data: Amount):
    account = get_or_404(name)
    try:
        account.withdraw(data.amount)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"owner": account.name, "balance": account.balance}