using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;

namespace CyberShield.Infrastructure.Services;

public class SslCertificateService
{
    public async Task<X509Certificate2?> GetCertificateAsync(string host)
    {
        try
        {
            using var client = new TcpClient();

            await client.ConnectAsync(host, 443);

            using var ssl = new SslStream(
                client.GetStream(),
                false,
                (_, _, _, _) => true);

            await ssl.AuthenticateAsClientAsync(host);

            if (ssl.RemoteCertificate == null)
                return null;

            return new X509Certificate2(ssl.RemoteCertificate);
        }
        catch
        {
            return null;
        }
    }
}