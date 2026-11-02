from pymysql import connect
import pymysql

connection = pymysql.connect(
    host='localhost',
     user='root',
     password='12345678',
     db='accounts',
     cursorclass=pymysql.cursors.DictCursor
)
