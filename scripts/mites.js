var dmz =
      { object: require("dmz/components/object")
      , objectType: require("dmz/runtime/objectType")
      , defs: require("dmz/runtime/definitions")
      , data: require("dmz/runtime/data")
      , mask: require("dmz/types/mask")
      , matrix: require("dmz/types/matrix")
      , message: require("dmz/runtime/messaging")
      , sphere: require("dmz/runtime/sphere")
      , time: require("dmz/runtime/time")
      , ui:
         { loader: require("dmz/ui/uiLoader")
         , mainWindow: require("dmz/ui/mainWindow")
         , consts: require("dmz/ui/consts")
         }
      , util: require("dmz/types/util")
      , vector: require("dmz/types/vector")
      }

// Constant decls

   , ChipOffset = dmz.vector.create (0, 0, -96)
   , UnitMatrix = dmz.matrix.create ()
   , MaxTurn = Math.PI / 2
   , TurnDelay = 3
   , Speed = 3000
   , WaitTime = 1
   , Arena =
        { max: dmz.vector.create([-3000, 0, -2000])
        , min: dmz.vector.create([3000, 0, 2000])
        }
   , MiteType = dmz.objectType.lookup("mite")
   , ChipType = dmz.objectType.lookup("chip")
   , MiteCount = 50
   , ChipCount = 100

   , MaximumAreaHandle = dmz.defs.createNamedHandle("Maximum_Area")
   , MinimumAreaHandle = dmz.defs.createNamedHandle("Minimum_Area")
   , LinkHandle = dmz.defs.createNamedHandle("Chip_Link")
   , TimerHandle = dmz.defs.createNamedHandle("Mite_Timer")
   , CountHandle = dmz.defs.createNamedHandle ("Chip_Count")
   , MitesHandle = dmz.defs.createNamedHandle ("Mites")
   , SpeedHandle = dmz.defs.createNamedHandle ("Speed")
   , TurnHandle = dmz.defs.createNamedHandle ("Turn")
   , TurnDelayHandle = dmz.defs.createNamedHandle ("TurnDelay")
   , PauseHandle = dmz.defs.createNamedHandle ("Pause")

// Global Variable decls
   , Mites = []
     /*
     { object: int Handle
     , pos: Vector position
     , ori: Matrix orientation
     , nextTurn: Number nextTurn
     , chip: reference to element of Chips[]
     }
     */
   , Chips = []
     /*
     { object: int Handle
     , pos: Vector position
     , mite: reference to an element of Mites[]
     }
     */
   , active = true
   , ControlsForm = dmz.ui.loader.load("./scripts/Controls.ui")
   , ControlsDock = dmz.ui.mainWindow.createDock
     ("Controls"
     , { area: dmz.ui.consts.LeftDockWidgetArea, floating: true }
     , ControlsForm
     )
   , reset = true
   , ClusterSphere = dmz.sphere.create()
   , HaulSphere = dmz.sphere.create()

// Function decls

   , calcNextTurnTime
   , validatePosition
   , updateMites
   , updateChips
   , updateMiteCount
   , updateChipCount
   , initMites
   , initChips
   , getMite = function (chip) { (chip && chip.mite) ? chip.mite : false; }
   , findChipCluster
   , updateChipClusters
   , findNearestChip
   , updateHaul
   , worker
   ;


calcNextTurnTime = function (delay) {
   var result = Math.random() * delay;
   return (result < 0) ? 0 : result;
};

validatePosition = function (pos) {

   if (pos.x > Arena.max.x) { pos.x = Arena.min.x - (Arena.max.x - pos.x); }
   else if (pos.x < Arena.min.x) { pos.x = Arena.max.x - (Arena.min.x - pos.x); }

   if (pos.z > Arena.max.z) { pos.z = Arena.min.z - (Arena.max.z - pos.z); }
   else if (pos.z < Arena.min.z) { pos.z = Arena.max.z - (Arena.min.z - pos.z); }
}

worker = function (time) {

   updateMites (time);
   updateChips (time);
   updateChipClusters (time);
   updateHaul (time);
}

updateMites = function (time) {

   var idx
     , mite
     , pos
     , ori
     ;

   if (reset) { initMites(); }
   if (active) {

//      for (mite in Mites) {
      Mites.forEach(function (mite) {

//         self.log.warn ("mite:", mite.object, mite.pos, mite.ori, mite.nextTurn, mite.chip);
         pos = mite.pos;
         ori = mite.ori;
         mite.nextTurn -= time;
         if (mite.nextTurn <= 0) {

            ori = dmz.matrix.create().fromAxisAndAngle(
                     dmz.vector.Up,
                     (Math.random() - 0.5) * MaxTurn)
                        .multiply(ori);
            mite.nextTurn = calcNextTurnTime(TurnDelay);
         }
         pos = pos.add(ori.transform(dmz.vector.Forward).multiply(time * Speed));
         validatePosition(pos);
         mite.pos = pos;
         mite.ori = ori;
         dmz.object.position(mite.object, null, mite.pos);
         dmz.object.orientation(mite.object, null, mite.ori);
      });
   }
}

updateChips = function (time) {

   var chip
     , mite
     , pos
     , ori
     ;
//   for (chip in Chips) {
   Chips.forEach(function (chip) {

      mite = getMite(chip);
      if (mite) {

         pos = mite.pos;
         ori = mite.ori;
         dmz.object.position (chip.object, null, pos.add(ori.transform (ChipOffset)));
      }
   });
}

initMites = function () {

   var mite
     , chip
     ;

   ClusterSphere.radius(800);
   HaulSphere.radius(80);
   // clearCanvas();

   // Move these two while loops to clearCanvas code.
   while (Mites.length > 0) {

      mite = Mites.pop();
      dmz.object.destroy (mite.object);
      mite.object = 0;
      mite.pos = dmz.vector.create();
      mite.ori = dmz.matrix.create();
      mite.chip = false;
   }
   while (Chips.length > 0) {

      chip = Chips.pop();
      dmz.object.destroy (chip.object);
      chip.object = 0;
      chip.pos = dmz.vector.create();
      chip.mite = false;
   }

   updateMiteCount(MiteCount);
   updateChipCount(ChipCount);
   reset = false;
}

updateMiteCount = function (count) {

   var MinX
     , MaxX
     , MinZ
     , MaxZ
     , mite
     ;

   MiteCount = count;
//   self.log.warn ("MiteCount:", MiteCount, Mites.length);
   MinX = Arena.min.x;
   MaxX = Arena.max.x;
   MinZ = Arena.min.z;
   MaxZ = Arena.max.z;

   while (Mites.length < MiteCount) {

      mite = {}
      mite.object = dmz.object.create (MiteType);
      mite.chip = false;
      mite.pos = dmz.vector.create(
         [ MaxX * Math.random() + MinX
         , 0
         , (MaxZ * Math.random()) + MinZ
         ]);
      dmz.object.position (mite.object, null, mite.pos);
      mite.ori =
         dmz.matrix.create().fromAxisAndAngle(dmz.vector.Up, Math.random() * Math.PI * 2);
      dmz.object.orientation (mite.object, null, mite.ori);
      dmz.object.activate(mite.object);
      mite.nextTurn = calcNextTurnTime(TurnDelay);
      Mites.push(mite);
//      self.log.warn ("Create mite:", mite.object, mite.pos, mite.ori, mite.nextTurn, mite.chip);
   }
   while (Mites.length > MiteCount) {

      mite = Mites.pop();
      dmz.object.destroy (mite.object);
      mite.object = 0;
      mite.pos = dmz.vector.create();
      mite.ori = dmz.matrix.create();
      if (mite.chip) { mite.chip.mite = false; mite.chip = false; }
   }
//   self.log.warn ("Mites:", Mites.length);
}

updateChipCount = function (count) {

   var MinX
     , MaxX
     , MinZ
     , MaxZ
     , chip
     ;

   ChipCount = count;
   MinX = Arena.min.x;
   MaxX = Arena.max.x;
   MinZ = Arena.min.z;
   MaxZ = Arena.max.z;
   while (Chips.length < ChipCount) {

      chip = {}
      chip.object = dmz.object.create (ChipType);
      chip.mite = false;
      chip.pos = dmz.vector.create(
         [ MaxX * Math.random() + MinX
         , 0
         , (MaxZ * Math.random()) + MinZ
         ]);
      dmz.object.position (chip.object, null, chip.pos);
      dmz.object.orientation (chip.object, null, UnitMatrix);
      dmz.object.activate(chip.object);
      Chips.push(chip);
   }
   while (Chips.length > ChipCount) {

      chip = Chips.pop();
      dmz.object.destroy (chip.object);
      chip.object = 0;
      chip.pos = dmz.vector.create();
      if (chip.mite) { chip.mite.chip = false; chip.mite = false; }
   }
}

findChipCluster = function (chips, chip) {

   var result = [chip.object]
     , net
     , chipHandle
     , type
     , links
     ;

   ClusterSphere.origin(chip.pos);
   net = dmz.object.find(ClusterSphere);
   if (net) {

//      for (chipHandle in net) {
      net.forEach(function (chipHandle) {

         if (!chips[chipHandle]) {

            type = dmz.object.type (chipHandle);
            if (type && type.isOfType(ChipType)) { result.push(chip); }
            chips[chipHandle] = true;
         }
      });
   }
   return result;
}

updateChipClusters = function () {

   var chips = {}
     , clusters = []
     , chip
     , index
     ;

//   for (chip in Chips) {
   Chips.forEach(function (chip) {

      if (!chips[chip.object]) {

         chips[chip.object] = true;
         clusters.push(findChipCluster (chips, chip))
      }
   });
   clusters.sort(function (obj1, obj2) { return obj2.length > obj1.length; });
   for (index = 0; index < clusters.length; index += 1) {

      clusters[index].forEach(function (chip) {
         dmz.object.counter (chip, CountHandle, index);
      });
//      for (chip in clusters[index]) { dmz.object.counter (chip, CountHandle, index); }
   }
}

findNearestChip = function (pos) {

   var result = false
     , net
     , done
     , count
     , object
     , type
     , links
     ;

   HaulSphere.origin(pos);
   net = dmz.object.find(HaulSphere);
   if (net) {

      done = false;
      count = 0;
      while (!done) {

         object = net[count];
         if (object) {

            type = dmz.object.type(object);
            if (type && type.isOfType(ChipType)) {

               links = dmz.object.superLinks(object, LinkHandle);
               if (!links) {

                  result = object;
                  done = true;
               }
            }
            count += 1;
         }
         else { done = true; }
      }
   }
   return result;
}

updateHaul = function (time) {

   var ctime
     , object
     , mite
     , timer
     , ori
     , pos
     , chip
     ;

   if (active) {

      ctime = dmz.time.getFrameTime();
//      for (mite in Mites) {
      Mites.forEach(function (mite) {

         timer = dmz.object.timeStamp (mite.object, TimerHandle);
         if (!timer) { timer = ctime; }
         if (timer <= ctime) {

            ori = mite.ori;
            pos = mite.pos;
            chip = findNearestChip(pos);
            if (chip) {

               if (mite.chip) {

                  mite.chip.mite = false;
                  mite.chip = false;
               }
               else {

                  mite.chip = chip;
                  chip.mite = mite;
               }
               dmz.object.timeStamp(mite.object, TimerHandle, ctime + WaitTime);
            }
         }
      });
   }
}

ControlsForm.observe(self, "resetButton", "clicked", function () { reset = true; });
ControlsForm.observe(self, "nodeSpinBox", "valueChanged", updateMiteCount);
ControlsForm.observe(self, "linkSpinBox", "valueChanged", updateChipCount);
ControlsForm.observe(self, "pauseButton", "clicked", function (btn) {

   active = !active;
   if (active) { btn.text("Pause"); }
   else { btn.text("Start"); }
});

dmz.time.setRepeatingTimer(self, worker);
