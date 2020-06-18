<html>
   
   <head>
        <title>Enter the title of the email message here.</title>
   </head>
   
   <body>
      
    <?php
        $to      = "your@email.com"; // Enter the recipient's email address here.
        $subject = "This is subject"; // The subject

        /**
         * Each line below represents a field on your form.
         * Add new lines if you add new fields to the form.
         * Remember to include the "name" attribute in your new fields.
         */

        $message = "<h1>This is headline.</h1>"; // The title of the email body

        if(isset($_POST['name'])) {
            $name = $_POST['name'];
        } else {
            $name = '';
        }

        if(isset($_POST['email'])) {
            $email = $_POST['email'];
        } else {
            $email = '';
        }

        if(isset($_POST['phone'])) {
            $phone = $_POST['phone'];
        } else {
            $phone = '';
        }

        if(isset($_POST['company'])) {
            $company = $_POST['company'];
        } else {
            $company = '';
        }

        if(isset($_POST['manager'])) {
            $manager = $_POST['manager'];
        } else {
            $manager = '';
        }

        if(isset($_POST['budget'])) {
            $budget = $_POST['budget'];
        } else {
            $budget = '';
        }

        if(isset($_POST['message'])) {
            $message = $_POST['message'];
        } else {
            $message = '';
        }

        $message .= "<p>Name: "    . $name    . '</p>'; // Field name
        $message .= "<p>Email: "   . $email   . '</p>'; // Field email
        $message .= "<p>Phone: "   . $phone   . '</p>'; // Field phone
        $message .= "<p>Company: " . $company . '</p>'; // Field company
        $message .= "<p>Manager: " . $manager . '</p>'; // Field manager
        $message .= "<p>Budget: "  . $budget  . '</p>'; // Field budget
        $message .= "<p>Message: " . $message . '</p>'; // Field message
        
        $header = "From:your@email.com \r\n"; // Enter the sender email address here
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/html\r\n";
        
        // This function sends the email
        $retval = mail ($to, $subject, $message, $header);
        
        // Here we receive response to display the message of success.
        if( $retval == true ) {
            echo true;
        } else {
            echo false;
        }
    ?>
      
   </body>
</html>