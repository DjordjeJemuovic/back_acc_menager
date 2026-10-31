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
        con = connection.cursor()
        con.execute(
            "UPDATE accaunt SET balance = %s WHERE owner = %s",
            (self.balance, self.name)
        )
        connection.commit()
        con.close()

    def withdraw(self, amount):
        self.balance -= amount
        con = connection.cursor()
        con.execute(
            "UPDATE accaunt SET balance = %s WHERE owner = %s",
            (self.balance, self.name)
        )
        connection.commit()
        con.close()
    def acc_info(self):
        con = connection.cursor()
        con.execute(
            "SELECT owner, balance FROM accaunt"
        )
        row = con.fetchall()
        for r in row:
            print(r)




user = BankAccount("Djordje", 1500)
user.acc_info()
