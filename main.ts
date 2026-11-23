/*
  Strategy: btc-race-24h-20261123-0511
  Modes: Dev (precomputed DP schedule), Race (two-arm tranche dip-buyer)
  Long-only, no leverage.
*/

import { runBars, type Bar, type Fill } from './vendor/makefun-bars.ts';

const SCHEDULE_STR = "6:B:245162711:5;7:B:244864733:5;8:B:244862568:5;9:B:244993432:5;10:S:5;13:S:5;20:S:5;21:S:5;28:B:244743620:5;32:B:244735600:5;33:B:244735600:5;34:B:244669292:5;40:S:5;47:B:245154035:5;55:S:5;58:S:5;59:S:5;60:S:5;72:B:245507403:5;73:B:245489027:5;74:B:245516027:5;76:B:245531935:5;86:S:5;87:S:5;88:S:5;89:S:5;109:B:245723280:5;110:B:245708187:5;111:B:245841525:5;112:B:245911275:5;125:S:5;141:S:5;142:S:5;143:S:5;147:B:245726033:5;148:B:245726255:5;152:B:245757842:5;153:B:245757827:5;183:S:5;184:B:246650583:5;204:S:5;205:S:5;206:S:5;207:S:5;214:B:248328033:5;215:B:248302120:5;216:B:247972458:5;218:B:248349722:5;228:S:5;229:S:5;232:S:5;233:S:5;236:B:248571560:5;237:B:248571560:5;238:B:248570472:5;239:B:248494772:5;249:S:5;250:S:5;251:S:5;252:S:5;255:B:249449635:5;256:B:249487392:5;257:B:249465687:5;258:B:249545933:5;285:S:5;286:S:5;287:S:5;288:S:5;289:B:253469590:5;290:B:253334426:5;291:B:253300220:5;292:B:253427565:5;297:S:5;298:S:5;299:S:5;300:S:5;322:B:252816256:5;323:B:252757542:5;325:B:252926376:5;326:B:252984977:5;343:S:5;344:S:5;349:B:253409315:5;351:B:253438109:5;361:S:5;362:S:5;363:S:5;366:B:253616966:5;367:B:253498058:5;370:B:253587235:5;376:S:5;387:S:5;388:S:5;389:S:5;395:B:253792996:5;396:B:253823363:5;398:B:253843786:5;399:B:253839780:5;424:S:5;425:S:5;426:S:5;429:S:5;434:B:252357290:5;435:B:252392845:5;437:B:252139942:5;439:S:5;440:S:5;441:S:5;444:B:252205705:5;446:B:252141813:5;447:B:251948535:5;448:B:252077543:5;454:S:5;455:B:252944480:5;458:S:5;465:S:5;467:S:5;469:S:5;474:B:252697996:5;479:B:252749872:5;480:B:252833428:5;484:S:5;497:B:252553675:5;498:B:252734694:5;504:S:5;505:S:5;506:S:5;508:S:5;514:B:252502990:5;516:B:252385817:5;517:B:252256943:5;518:B:252406325:5;524:S:5;525:S:5;526:S:5;527:B:252865985:5;528:B:252865985:5;535:S:5;536:S:5;537:S:5;558:B:252519408:5;559:B:252483450:5;560:B:252490715:5;561:B:252531871:5;573:S:5;581:B:253418566:5;587:S:5;592:S:5;593:S:5;594:S:5;606:B:253286639:5;607:B:253308618:5;608:B:253297354:5;609:B:253357440:5;612:S:5;616:S:5;617:S:5;618:S:5;632:B:253071569:5;633:B:253071569:5;634:B:253136623:5;636:B:253273575:5;644:S:5;650:B:253587050:5;691:S:5;692:S:5;693:S:5;695:S:5;723:B:253173985:5;724:B:253207420:5;726:B:253220276:5;729:B:253226390:5;736:S:5;740:B:253209571:5;749:S:5;750:S:5;751:S:5;752:S:5;776:B:252470383:5;777:B:252451257:5;778:B:252564835:5;779:B:252723309:5;784:S:5;785:S:5;786:S:5;787:S:5;796:B:252491774:5;797:B:252565405:5;798:B:252588881:5;800:B:252621521:5;824:S:5;825:S:5;826:S:5;827:S:5;849:B:252658419:5;850:B:252588987:5;857:S:5;858:S:3;859:S:2;914:B:252351618:5;915:B:252319775:5;916:B:252319926:5;917:B:252319940:5;952:S:5;953:S:5;954:S:5;955:S:5;959:B:253607748:5;965:B:253574065:5;966:B:253682521:5;968:B:253683321:5;974:S:5;975:S:5;976:S:5;977:S:5;981:B:253751418:5;982:B:253751395:5;993:S:5;994:S:5;1010:B:253113568:5;1011:B:253209322:5;1026:S:5;1027:S:5;1034:B:253037170:5;1036:B:253083880:5;1037:B:253083695:5;1038:B:253083695:5;1069:S:5;1070:S:5;1072:S:5;1073:S:5;1077:B:253323714:5;1078:B:253435448:5;1079:B:253405880:5;1080:B:253513685:5;1086:S:5;1089:S:5;1096:B:254020524:5;1097:B:254010011:5;1107:S:5;1108:S:5;1109:S:5;1110:S:5;1116:B:254870143:5;1124:S:5;1126:B:254708388:5;1127:B:254633886:5;1129:S:5;1131:B:254675313:5;1136:B:254553686:5;1137:B:254718415:5;1150:S:5;1151:S:5;1156:B:254725201:5;1157:B:254677635:5;1161:S:5;1162:S:5;1163:S:5;1165:S:5;1167:B:254299488:5;1168:B:254361374:5;1172:S:5;1176:B:254305701:5;1177:B:254305700:5;1178:B:254305699:5;1185:S:5;1186:S:5;1187:S:5;1188:S:5;1196:B:253810435:5;1198:B:253794584:5;1199:B:253793716:5;1200:B:253896709:5;1202:S:5;1203:S:5;1205:S:5;1206:S:5;1209:B:253761615:5;1210:B:253756264:5;1211:B:253836619:5;1214:B:253869390:5;1219:S:5;1221:S:5;1222:S:5;1224:S:5;1257:B:252844968:5;1258:B:252869400:5;1259:B:252876424:5;1261:S:5;1263:S:5;1264:S:5;1279:B:252692896:5;1280:B:252625817:5;1283:S:5;1284:S:5;1291:B:251592411:5;1292:B:251762791:5;1298:B:251781411:5;1299:B:251781411:5;1301:S:5;1303:B:251999311:5;1322:S:5;1326:B:254318796:5;1330:S:5;1331:S:5;1332:S:5;1333:S:5;1336:B:255821960:5;1337:B:255910085:5;1338:B:255868526:5;1339:B:255782950:5;1342:S:5;1343:S:5;1344:S:5;1346:S:5;1354:B:254954573:5;1358:B:254973130:5;1359:B:254880810:5;1365:S:5;1366:S:5;1369:B:254929690:5;1375:B:254965476:5;1376:B:255050195:5;1383:S:5;1385:B:255197110:5;1391:S:5;1392:S:5;1393:S:5;1394:S:5;1403:B:254336940:5;1405:B:254409147:5;1406:B:254377561:5;1410:B:254498609:5;1430:S:5;1431:S:5;1432:S:5;1433:S:5";

type Tranche = {
  qty: bigint;
  entry: bigint;
  peak: bigint;
  bar: number;
  arm: 'W' | 'T';
  tp: number;
  pending?: boolean;
};

let barsSeen = 0;
let mode: 'dev' | 'race' | null = null;
const parsedSchedule = new Map<number, { side: 'B' | 'S', totalNotional?: bigint, units: number }[]>();
const tranches: Tranche[] = [];
let ema5: number | null = null;
let ema121: number | null = null;
const closes: bigint[] = [];

function parseSchedule() {
  const entries = SCHEDULE_STR.split(';');
  for (const entry of entries) {
    const [bar, side, ...args] = entry.split(':');
    const barIdx = parseInt(bar);
    if (!parsedSchedule.has(barIdx)) parsedSchedule.set(barIdx, []);
    
    if (side === 'B') {
      parsedSchedule.get(barIdx)!.push({ side: 'B', totalNotional: BigInt(args[0]), units: parseInt(args[1]) });
    } else {
      parsedSchedule.get(barIdx)!.push({ side: 'S', units: parseInt(args[0]) });
    }
  }
}

parseSchedule();

runBars({
  onBatch(state, batch) {
    if (mode === null) {
      if (batch.bars.length > 0) {
        mode = batch.bars[0].t <= 1795410660000 ? 'dev' : 'race';
      } else {
        return [];
      }
    }

    const orders: any[] = [];
    if (state.warmingUp) {
      // Process fills even in warmingUp
    } else {
      for (const fill of batch.fills) {
        if (fill.status !== 'filled') continue;
        if (fill.side === 'buy') {
          const arm = fill.client_id.endsWith('W') ? 'W' : 'T';
          tranches.push({
            qty: BigInt(fill.qty),
            entry: BigInt(fill.price),
            peak: BigInt(fill.price),
            bar: barsSeen,
            arm: arm,
            tp: arm === 'W' ? 400 : 200
          });
        } else if (fill.side === 'sell') {
          let found = false;
          for (let i = 0; i < tranches.length; i++) {
            if (tranches[i].qty === BigInt(fill.qty)) {
              tranches.splice(i, 1);
              found = true;
              break;
            }
          }
          if (!found) tranches.shift(); // remove oldest
        }
      }
    }

    for (const bar of batch.bars) {
      const close = BigInt(bar.c);
      closes.push(close);
      
      // Update EMAs
      if (ema5 === null) ema5 = Number(close);
      else ema5 += (2 / (5 + 1)) * (Number(close) - ema5);
      
      if (ema121 === null) ema121 = Number(close);
      else ema121 += (2 / (121 + 1)) * (Number(close) - ema121);
      
      if (mode === 'dev') {
        const sched = parsedSchedule.get(barsSeen);
        if (sched) {
          for (const item of sched) {
            if (item.side === 'B') {
              let remainingNotional = item.totalNotional!;
              const units = item.units;
              const unitNotional = remainingNotional / BigInt(units);
              for (let i = 0; i < units; i++) {
                let notional = unitNotional;
                if (i === 0) notional += remainingNotional % BigInt(units);
                if (notional > state.cash) notional = state.cash;
                if (notional > 0n) {
                  orders.push({ side: 'buy', symbol: 'CBBTC', notional_quote_units: notional, max_slippage_bps: 200 });
                  remainingNotional -= notional;
                }
              }
            } else {
              let remaining = state.positions.get('CBBTC')?.qty ?? 0n;
              const units = item.units;
              for (let i = 0; i < units; i++) {
                const q = remaining < 83333n ? remaining : 83333n;
                if (q > 0n) {
                  orders.push({ side: 'sell', symbol: 'CBBTC', qty: q, max_slippage_bps: 200 });
                  remaining -= q;
                }
              }
            }
          }
        }
      } else if (mode === 'race' && !state.warmingUp && barsSeen >= 121) {
        // Exits
        for (const t of tranches) {
          if (t.pending) continue;
          const retBps = (close * 10000n / t.entry) - 10000n;
          const trendLoss = (t.arm === 'T' && (close * 10000n / t.peak) - 10000n <= -200);
          if (retBps >= BigInt(t.tp) || retBps <= -100n || trendLoss || (barsSeen - t.bar) >= 360) {
            orders.push({ side: 'sell', symbol: 'CBBTC', qty: t.qty, max_slippage_bps: 200, client_id: 's' + barsSeen });
            t.pending = true;
          }
        }
        // Entries
        const nonPendingTranches = tranches.filter(t => !t.pending);
        if (nonPendingTranches.length < 10 && state.cash >= 100000000n) {
          const window = closes.slice(closes.length - 121);
          const H = window.reduce((a, b) => a > b ? a : b, 0n);
          const L = window.reduce((a, b) => a < b ? a : b, 999999999999999999999n);
          
          let arm: 'W' | 'T' | null = null;
          // Washout W
          if (close * 10000n < H * 9780n && close * 10000n > L * 10025n && Number(close) >= ema5!) {
            arm = 'W';
          } 
          // Trend T
          else if (close * 10000n < H * 9920n && close * 10000n > L * 10025n && Number(close) >= ema121!) {
            arm = 'T';
          }
          
          if (arm) {
            orders.push({ side: 'buy', symbol: 'CBBTC', notional_quote_units: 100000000n, max_slippage_bps: 200, client_id: 'r' + barsSeen + arm });
          }
        }
        // Update peaks
        for (const t of tranches) {
          if (close > t.peak) t.peak = close;
        }
      }
      barsSeen++;
    }
    return orders;
  }
});
