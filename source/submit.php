<?php
if(isset($_POST['subject']) && isset($_POST['email']) && isset($_POST['name']) && isset($_POST['question']) && isset($_POST['phone_number'])){
    $subject = $_POST['subject'];
    $email = $_POST['email'];
    $name = $_POST['name'];
    $question = $_POST['question'];
    $phoneNumber = $_POST['phone_number'];

    $to = 'resume@ooo-modern.ru';
    $mail_subject = 'Questions from DreamCreditMaker: '.$subject;
    $mail_body = "Email: ".$email."\n"
                ."Name: ".$name."\n"
                ."Question: ".$question."\n"
                ."Phone Number: ".$phoneNumber."\n";

    $headers = 'From: '.$email."\r\n".
               'Reply-To: '.$email."\r\n".
               'X-Mailer: PHP/'.phpversion();

    if(mail($to, $mail_subject, $mail_body, $headers)){
        echo 'Письмо успешно отправлено.';
    }else{
        echo 'Ошибка при отправке письма.';
    }
}
?>
