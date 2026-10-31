from models.db import connection

class BankAccount:
    def __init__(self, name, balance):
        self.name = name
        self.balance = balance

    def create_account(self):
        con = connection.cursor()
        con.execute(
            "INSERT INTO accaunt (owner, balance) VALUES (%s, %s)",
            (self.name, self.balance)
        )
        connection.commit()
        con.close()



    def deposit(self, amount):
        self.balance += amount
        return self.balance


name = input("Enter your name: ")
balance = int(input("Enter your balance: "))
user = BankAccount(name, balance)
user.create_account()
