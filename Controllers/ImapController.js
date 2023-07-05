    
const Imap = require('node-imap');

const index = async(req,res,next)=>{
    let {limit,page}=req.query; 
    const imap = new Imap({
    user: 'meeranjianees1@gmails.com',
    password:'ncfpymmugcmtfdkc',
    host: 'imap.gmail.com',
    port: 993,
    tls: true
    });



  

    imap.connect();

  imap.once('ready', function() {
    // Open the mailbox (e.g., 'INBOX')
    imap.openBox('INBOX', true, function(err, box) {
      if (err) {
        console.error('Error opening mailbox:', err);
        return res.status(500).json({ error: 'Failed to open mailbox' });
      }

      const pageSize =  limit||1; // Number of emails per page
      const currentPage = page||1; // Get the current page from the query parameter

      // Calculate the starting and ending sequence numbers based on the current page
      const startIndex = Math.max(1, box.messages.total - pageSize * currentPage + 1);
      const endIndex = box.messages.total - pageSize * (currentPage - 1);

      // Fetch the emails for the current page
      const fetch = imap.seq.fetch(startIndex + ':' + endIndex, { bodies: '', struct: true });

      const emails = []; // Array to store the fetched emails

            fetch.on('message', function(msg, seqno) {
            const email = { seqno: seqno , body: '',from: '', subject: '' };

            msg.on('body', function(stream, info) {
                
                  let body = '';
    
                  stream.on('data', function(chunk) {
                    console.log(chunk.toString());
                    body += chunk.toString();
                  });
    
                  stream.on('end', function() {
                    email.body = body;
                  });
                
            });
           

            emails.push(email); // Add the email to the array
            });


      // When all emails have been processed, send the JSON response
      fetch.on('end', function() {
        imap.end();

        let htmlResponse = '<table style="border:1px solid black;border-collapse: collapse;">';
        htmlResponse += '<tr>';
        htmlResponse += '<th  style="border:1px solid black;border-collapse: collapse;">SEQ NO</th>';
        htmlResponse += '<th  style="border:1px solid black;border-collapse: collapse;">Subject</th>';
         htmlResponse += '<th  style="border:1px solid black;border-collapse: collapse;">From</th>';
        // htmlResponse += '<th>To</th>';
        // htmlResponse += '<th>Headers</th>';
         htmlResponse += '<th  style="border:1px solid black;border-collapse: collapse;">Body</th>';
        // htmlResponse += '<th>HTML</th>';
        htmlResponse += '</tr>';

        emails.forEach(function(email) {
          htmlResponse += '<tr>';
          htmlResponse += '<td style="border:1px solid black;border-collapse: collapse;" >' + email.seqno + '</td>';
          htmlResponse += '<td style="border:1px solid black;border-collapse: collapse;" >' + email.subject + '</td>';
          htmlResponse += '<td style="border:1px solid black;border-collapse: collapse;" >' + email.from + '</td>';
        //   htmlResponse += '<td>' + email.from + '</td>';
        //   htmlResponse += '<td>' + email.to + '</td>';
        //   htmlResponse += '<td><pre>' + JSON.stringify(email.headers, null, 2) + '</pre></td>';
           htmlResponse += '<td style="border:1px solid black;border-collapse: collapse;" ><pre>' + email.body + '</pre></td>';
        //   htmlResponse += '<td><pre>' + email.html + '</pre></td>';
          htmlResponse += '</tr>';
        });

        htmlResponse += '</table>';

        return res.status(200).send(htmlResponse);

        return res.status(200).json(emails);
      });
    });
  });

  imap.on('error', function(err) {
    console.error('IMAP connection error:', err);
    return res.status(500).json({ error: 'IMAP connection error' });
  });
};




module.exports = { index };