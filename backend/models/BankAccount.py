from models.db import connection


class BankAccount:
    def __init__(self, name, balance):
        self.name = name
        self.balance = balance

    def create_account(self):
        cur = connection.cursor()
        cur.execute(
            "INSERT INTO accaunt (owner, balance) VALUES (%s, %s)",
            (self.name, self.balance)
        )
        connection.commit()
        cur.close()

    @staticmethod
    def find(name):
        """Vraća BankAccount iz baze, ili None ako ne postoji."""
        cur = connection.cursor()
        cur.execute("SELECT owner, balance FROM accaunt WHERE owner = %s", (name,))
        row = cur.fetchone()
        cur.close()
        if row is None:
            return None
        return row

    @staticmethod
    def show_all():
        cur = connection.cursor()
        cur.execute("SELECT owner, balance FROM accaunt")
        rows = cur.fetchall()
        cur.close()
        return rows

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Iznos mora biti veći od 0.")
        self.balance += amount
        self._save()

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Iznos mora biti veći od 0.")
        if amount > self.balance:
            raise ValueError("Nema dovoljno sredstava na računu.")
        self.balance -= amount
        self._save()

    def _save(self):
        cur = connection.cursor()
        cur.execute(
            "UPDATE accaunt SET balance = %s WHERE owner = %s",
            (self.balance, self.name)
        )
        connection.commit()
        cur.close()