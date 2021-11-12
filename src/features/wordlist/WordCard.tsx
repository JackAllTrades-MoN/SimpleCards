import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Word } from '../../common/word';

export interface WordCardProps {
    word: Word,
    deleteEntry: (name: string) => void,
}

export const WordCard = (props: WordCardProps) => {
    const descr = props.word.description?.map(
      entry => <div>
        {entry.meanings.map(meaning => <div>
          {`(${meaning.partOfSpeech})`}<br />
          {meaning.definitions.map(ddef => <div>
            {`- ${ddef.definition}`}<br />
            {`e.g., ${ddef.example}`}
          </div>)}
        </div>)}
      </div>
    );
    return (
      <Tooltip title={ descr || 'NotFound' }>
        <Card sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box>
            <CardContent>
              <Typography>
                { `${props.word.name} (${props.word.cnt})` }
              </Typography>
            </CardContent>          
          </Box>
          <Box sx={{ backgroundColor: '#f8d7d9' }}>
            <CardContent>
              <IconButton
                onClick={() => props.deleteEntry(props.word.name)} >
                <HighlightOffIcon />
              </IconButton>
            </CardContent>
          </Box>
        </Card>
      </Tooltip>
    );
  }