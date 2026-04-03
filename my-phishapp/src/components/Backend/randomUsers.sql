
DELIMITER $$

CREATE PROCEDURE insert_unique_indian_employees()
BEGIN
    DECLARE i INT DEFAULT 0;

    WHILE i < 500 DO

        INSERT INTO users (name, department, designation, email, joining_date, password)
        VALUES (
            CONCAT(
                ELT(1 + (i % 50),
                    'Amit','Rahul','Priya','Sneha','Vikram','Anjali','Rohit','Neha','Karan','Pooja',
                    'Arjun','Divya','Manish','Kavita','Suresh','Deepak','Nisha','Rajesh','Meera','Ajay',
                    'Sunil','Ritu','Alok','Swati','Gaurav','Payal','Harish','Tanvi','Varun','Shweta',
                    'Nitin','Rekha','Sanjay','Komal','Yash','Isha','Prakash','Rashmi','Anil','Bhavna',
                    'Mohit','Seema','Vikas','Lata','Ramesh','Geeta','Aakash','Pallavi','Siddharth','Maya'
                ),
                ' ',
                ELT(1 + FLOOR(i / 50),
                    'Sharma','Verma','Patel','Reddy','Singh',
                    'Mehta','Gupta','Joshi','Malhotra','Nair'
                )
            ),

            ELT(1 + (i % 5),
                'HR','IT','Finance','Marketing','Operations'
            ),

            ELT(1 + (i % 5),
                'Manager','Developer','Analyst','Executive','Team Lead'
            ),

            CONCAT(
                LOWER(REPLACE(
                    CONCAT(
                        ELT(1 + (i % 50),
                            'amit','rahul','priya','sneha','vikram','anjali','rohit','neha','karan','pooja',
                            'arjun','divya','manish','kavita','suresh','deepak','nisha','rajesh','meera','ajay',
                            'sunil','ritu','alok','swati','gaurav','payal','harish','tanvi','varun','shweta',
                            'nitin','rekha','sanjay','komal','yash','isha','prakash','rashmi','anil','bhavna',
                            'mohit','seema','vikas','lata','ramesh','geeta','aakash','pallavi','siddharth','maya'
                        ),
                        ELT(1 + FLOOR(i / 50),
                            'sharma','verma','patel','reddy','singh',
                            'mehta','gupta','joshi','malhotra','nair'
                        )
                    ), ' ', ''
                )),
                i,
                '@company.com'
            ),

            DATE_SUB(CURDATE(), INTERVAL (i % 1000) DAY),

            '$2a$10$examplehashedpassword1234567890'
        );

        SET i = i + 1;
    END WHILE;

END$$

DELIMITER ;

CALL insert_unique_indian_employees();