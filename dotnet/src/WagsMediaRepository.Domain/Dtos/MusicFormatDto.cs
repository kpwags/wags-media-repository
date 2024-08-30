namespace WagsMediaRepository.Domain.Dtos;

public class MusicFormatDto
{
    public int MusicFormatId { get; set; }
    
    public string Name { get; set; } = String.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<MusicAlbumToMusicFormatDto> MusicAlbumToMusicFormats { get; set; } = [];
}