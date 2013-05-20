::

        Host wtps*
          User root
          IdentityFile ~/.ssh/id_rsa_wtps
          ProxyCommand ssh -i ~/.ssh/id_rsa_wtps root@210.129.195.213 nc -w 60 %h %p

        Host wtps2
          Hostname 10.1.1.82

        Host wtps3
          Hostname 10.1.2.94

        Host wtpsdb
          Hostname 10.1.0.14

        Host wtpsdb0
          Hostname 10.1.1.35

        Host wtpsdb1
          Hostname 10.1.3.41

        Host wtps
          User root
          IdentityFile ~/.ssh/id_rsa_wtps
          Hostname 210.129.195.213

